const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLBoolean } = require("graphql");
const Order = require("../db/models/order");
const MenuItem = require("../db/models/menuItem");
const configs = require("../config/configs");

const OrderListItemInput = new GraphQLInputObjectType({
	name: "OrderListItemInput",
	fields: {
		menuItemId: { type: GraphQLInt },
		itemCount: { type: GraphQLInt },
	},
})
const OrderListItem = new GraphQLObjectType({
	name: "OrderListItem",
	fields: {
		menuItemId: { type: GraphQLInt },
		itemName: { type: GraphQLString },
		img: { type: GraphQLString },
		itemCount: { type: GraphQLInt },
		itemPrice: { type: GraphQLInt },
		itemTotalPrice: { type: GraphQLInt },
		currency: { type: GraphQLString },
		date: { type: GraphQLID },
	},
})

const OrderType = new GraphQLObjectType({
	name: 'Order',
	fields: () => ({
		_id: {type: GraphQLID},
		accountId: {type: GraphQLID},
		tableId: {type: GraphQLID},
		cart: {type: new GraphQLList(OrderListItem)},
		reserveToken: {type: GraphQLString},
		isPaid: {type: GraphQLBoolean},
		notes: {type: GraphQLString},
	}),
})

const OrderMutations = {
	addOrder: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLInt },
			tableId: { type: GraphQLInt },
			reserveToken: { type: GraphQLString },
			orderList: { type: new GraphQLList(OrderListItemInput)},
		},
		async resolve(parent, args){
			const { accountId, tableId, reserveToken, orderList } = args;
			const invalidItemsCount = orderList.filter(item => item.itemCount <= 0).length;
			if (invalidItemsCount > 0) {
				throw new Error("Invalid item count provided in order list.")
			}
			const menuItemIds = orderList.map(item => item.menuItemId);

			const foundMenuItems = await MenuItem.find({ accountId, _id: {"$in": menuItemIds }}).lean();
			if (foundMenuItems.length !== menuItemIds.length) {
				throw new Error("Not all menuItems exists.")
			}
			const order = await Order.findOne({ accountId, tableId, reserveToken }).lean();
			let newOrder;
			if (order) {
				let cart = order.cart;
				let cartSize = order.cart.length;
				orderList.forEach(itemData => {
					const itemIndex = cart.findIndex((cartItem) => {
						return cartItem.menuItemId === itemData.menuItemId
					});
					if (itemIndex >= 0) {
						cart[itemIndex].itemCount += itemData.itemCount;
						cart[itemIndex].date = Date.now();
						cart[itemIndex].itemTotalPrice = cart[itemIndex].itemCount * cart[itemIndex].itemPrice;
					} else {
						const menuItemData = foundMenuItems.find(item => item._id === itemData.menuItemId);
						cart[cartSize++] = {
							menuItemId: itemData.menuItemId,
							itemCount: itemData.itemCount,
							itemName: menuItemData.name,
							img: menuItemData.img,
							itemPrice: menuItemData.price,
							itemTotalPrice: itemData.itemCount * menuItemData.price,
							currency: menuItemData.currency
						};
					}
				});
				const totalPrice = cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const totalItems = cart.reduce((total, cartItem) => total + cartItem.itemCount , 0);
				newOrder = await Order.findOneAndUpdate({ accountId, tableId, reserveToken }, { cart, totalPrice, totalItems }, { new: true, upsert: true }).lean();
				return newOrder;
			} else {
				const cart = orderList.map(orderItem => {
					const menuItemData = foundMenuItems.find(menuItem => menuItem._id === orderItem.menuItemId);
					return ({
						...orderItem,
						itemName: menuItemData.name,
						img: menuItemData.img,
						itemPrice: menuItemData.price,
						itemTotalPrice: orderItem.itemCount * menuItemData.price,
						currency: menuItemData.currency,
					})
				})
				const totalPrice = cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const totalItems = cart.reduce((total, cartItem) => total + cartItem.itemCount , 0);
				const orderEntity = new Order({ accountId, tableId, reserveToken, cart, totalPrice, totalItems, notes: "Created by user after adding order." });
				newOrder = await orderEntity.save();
				return newOrder
			}
		}
	},
	reduceOneMenuItemCount: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLInt },
			tableId: { type: GraphQLInt },
			reserveToken: { type: GraphQLString },
			menuItemId: { type: GraphQLInt },
		},
		async resolve(parent, args){
			const { accountId, tableId, reserveToken, menuItemId } = args;
			const allowedDateFrom = Date.now() - configs.orderEditDuration;
			Order.findOne(
				{ accountId, tableId, reserveToken, cart: { $elemMatch: { menuItemId, date: { $gt: allowedDateFrom }, itemCount: { $gt: 0 } } } },
				(err, order) => {
				if (err) {
					throw new Error("Internal server error");
				} else if (!order) {
					throw new Error("Not found editable menu item in cart with specified id");
				} else {
					order.cart = order.cart.reduce((newCart, cartItem) => {
						if (cartItem.menuItemId === menuItemId && cartItem.itemCount > 0) {
							cartItem.itemCount--;
							cartItem.itemTotalPrice -= cartItem.itemPrice;
						}
						return newCart;
					}, order.cart).filter(cartItem => cartItem.itemCount > 0);
					order.totalPrice = order.cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
					order.totalItems = order.cart.reduce((total, cartItem) => total + cartItem.itemCount , 0);
					order.save((err, newOrder) => {
						if (err) {
							throw new Error("Internal server error");
						} else if (!newOrder) {
							throw new Error("Not found menuItem in cart with specified id");
						} else {
							return newOrder;
						}
					})
				}
			})
		}
	},
	removeMenuItemFromOrder: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLInt },
			tableId: { type: GraphQLInt },
			reserveToken: { type: GraphQLString },
			menuItemId: { type: GraphQLInt },
		},
		async resolve(parent, args){
			const { accountId, tableId, reserveToken, menuItemId } = args;
			const allowedDateFrom = Date.now() - configs.orderEditDuration;
			Order.findOne(
				{ accountId, tableId, reserveToken, cart: { $elemMatch: { menuItemId, date: { $gt: allowedDateFrom }, itemCount: { $gt: 0 } } } },
				(err, order) => {
					if (err) {
						throw new Error("Internal server error");
					} else if (!order) {
						throw new Error("Not found menuItem in cart with specified id");
					} else {
						order.cart = order.cart.filter(cartItem => cartItem.menuItemId !== menuItemId && cartItem.itemCount > 0);
						order.totalPrice = order.cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
						order.totalItems = order.cart.reduce((total, cartItem) => total + cartItem.itemCount , 0);
						order.save((err, newOrder) => {
							if (err) {
								throw new Error("Internal server error");
							} else if (!newOrder) {
								throw new Error("Not found editable menu item in cart with specified id");
							} else {
								return newOrder;
							}
						})
					}
				})
		}
	}
}

module.exports = {
	OrderType,
	OrderMutations
}