const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLBoolean } = require("graphql");
const Order = require("../db/models/order");
const Account = require("../db/models/account");
const MenuItem = require("../db/models/menuItem");
const configs = require("../config/configs");
const { toObjectId } = require("../helpers/conversions");

const OrderListItemInput = new GraphQLInputObjectType({
	name: "OrderListItemInput",
	fields: {
		menuItemId: { type: GraphQLInt },
		itemCount: { type: GraphQLInt },
	},
});

const TempCartMovement = new GraphQLObjectType({
	name: "TempCartMovement",
	fields: {
		type: { type: GraphQLString },
		count: { type: GraphQLInt },
		date: { type: GraphQLID },
	},
});

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
});
const TempCartItem = new GraphQLObjectType({
	name: "TempCartItem",
	fields: {
		menuItemId: { type: GraphQLInt },
		itemName: { type: GraphQLString },
		img: { type: GraphQLString },
		itemCount: { type: GraphQLInt },
		itemPrice: { type: GraphQLInt },
		itemTotalPrice: { type: GraphQLInt },
		currency: { type: GraphQLString },
		movements: { type: new GraphQLList(TempCartMovement) },
	},
});

const OrderType = new GraphQLObjectType({
	name: 'Order',
	fields: () => ({
		_id: { type: GraphQLInt },
		accountId: { type: GraphQLString },
		tableId: { type: GraphQLString },
		tempCart: { type: new GraphQLList(TempCartItem) },
		cart: { type: new GraphQLList(OrderListItem) },
		reserveToken: { type: GraphQLString },
		isPaid: { type: GraphQLBoolean },
		totalPrice: { type: GraphQLInt },
		totalItems: { type: GraphQLInt },
		tempTotalPrice: { type: GraphQLInt },
		tempTotalItems: { type: GraphQLInt },
		notes: { type: GraphQLString },
	}),
})

const OrderMutations = {
	addToTempCart: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
			orderList: { type: new GraphQLList(OrderListItemInput)},
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken, orderList } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const account = await Account.findOne({ _id: accountId }).lean();
			if (!account || account.status !== "enabled") {
				throw new Error("Account not active now.");
			}
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
				const tempCart = order.tempCart;
				orderList.forEach((itemData) => {
					const menuItemData = foundMenuItems.find(menuItem => menuItem._id === itemData.menuItemId);
					const tempCartItemIndex = tempCart.findIndex((tempCartItem) => {
						return tempCartItem.menuItemId === itemData.menuItemId;
					})
					if (tempCartItemIndex < 0) {
						tempCart.push({
							menuItemId: itemData.menuItemId,
							itemName: menuItemData.name,
							img: menuItemData.img,
							itemCount: itemData.itemCount,
							itemPrice: menuItemData.price,
							itemTotalPrice: itemData.itemCount * menuItemData.price,
							currency: menuItemData.currency,
							movements: [
								{
									type: "addToTempCart",
									count: itemData.itemCount,
									date: Date.now(),
								},
							],
						});
					} else {
						const oldData = tempCart[tempCartItemIndex];
						oldData.movements.push({
							type: "addToTempCart",
							count: itemData.itemCount,
							date: Date.now(),
						})
						tempCart[tempCartItemIndex] = {
							...oldData,
							itemCount: oldData.itemCount + itemData.itemCount,
							itemTotalPrice: oldData.itemTotalPrice + (itemData.itemCount * menuItemData.price),
							movements: oldData.movements,
						};
					}
				})
				const tempTotalPrice = tempCart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const tempTotalItems = tempCart.reduce((total, cartItem) => total + cartItem.itemCount , 0);

				newOrder = await Order.findOneAndUpdate({ accountId, tableId, reserveToken }, { $set: { tempCart, tempTotalPrice, tempTotalItems } }, { new: true, upsert: true }).lean();
				return newOrder;
			} else {
				const tempCart = orderList.map(orderItem => {
					const menuItemData = foundMenuItems.find(menuItem => menuItem._id === orderItem.menuItemId);
					return {
						...orderItem,
						itemName: menuItemData.name,
						img: menuItemData.img,
						itemPrice: menuItemData.price,
						itemTotalPrice: orderItem.itemCount * menuItemData.price,
						currency: menuItemData.currency,
						movements: [
							{
								type: "addToTempCart",
								count: orderItem.itemCount,
								date: Date.now(),
							}
						],
					}
				})
				const tempTotalPrice = tempCart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const tempTotalItems = tempCart.reduce((total, cartItem) => total + cartItem.itemCount , 0);

				const orderEntity = new Order({ accountId, tableId, reserveToken, cart: [], tempCart, totalPrice: 0, totalItems: 0, tempTotalPrice, tempTotalItems, notes: "Created by user after adding order.", dateCreated: new Date() });
				newOrder = await orderEntity.save();
				return newOrder;
			}
		}
	},
	reduceFromTempCartOneMenuItem: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
			menuItemId: { type: GraphQLInt },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken, menuItemId } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const account = await Account.findOne({ _id: accountId }).lean();
			if (!account || account.status !== "enabled") {
				throw new Error("Account not active now.");
			}
			const order = await Order.findOne({ accountId, tableId, reserveToken }).lean();

			let newOrder;
			if (order) {
				const tempCart = order.tempCart;
				const tempCartItemIndex = tempCart.findIndex((tempCartItem) => {
					return tempCartItem.menuItemId === menuItemId;
				})
				if (tempCartItemIndex < 0) {
					throw new Error("Item not found in your cart.")
				} else {
					const oldData = tempCart[tempCartItemIndex];
					if (oldData.itemCount < 1) {
						throw new Error("Item not found in your cart.");
					}
					oldData.movements.push({
						type: "removeFromTempCart",
						count: -1,
						date: Date.now(),
					})
					tempCart[tempCartItemIndex] = {
						...oldData,
						itemCount: oldData.itemCount - 1,
						itemTotalPrice: oldData.itemTotalPrice - oldData.itemPrice,
						movements: oldData.movements,
					};
				}
				const tempTotalPrice = tempCart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const tempTotalItems = tempCart.reduce((total, cartItem) => total + cartItem.itemCount , 0);

				newOrder = await Order.findOneAndUpdate({ accountId, tableId, reserveToken }, { $set: { tempCart, tempTotalPrice, tempTotalItems } }, { new: true, upsert: true }).lean();
				return newOrder;
			} else {
				throw new Error("Order not found.")
			}
		}
	},
	removeFromTempCartMenuItem: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
			menuItemId: { type: GraphQLInt },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken, menuItemId } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const account = await Account.findOne({ _id: accountId }).lean();
			if (!account || account.status !== "enabled") {
				throw new Error("Account not active now.");
			}
			const order = await Order.findOne({ accountId, tableId, reserveToken }).lean();

			let newOrder;
			if (order) {
				const tempCart = order.tempCart;
				const tempCartItemIndex = tempCart.findIndex((tempCartItem) => {
					return tempCartItem.menuItemId === menuItemId;
				})
				if (tempCartItemIndex < 0) {
					throw new Error("Item not found in your cart.")
				} else {
					const oldData = tempCart[tempCartItemIndex];
					if (oldData.itemCount < 1) {
						throw new Error("Item not found in your cart.");
					}
					oldData.movements.push({
						type: "removeFromTempCart",
						count: -oldData.itemCount,
						date: Date.now(),
					});
					tempCart[tempCartItemIndex] = {
						...oldData,
						itemCount: 0,
						itemTotalPrice: 0,
						movements: oldData.movements,
					};
				}
				const tempTotalPrice = tempCart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const tempTotalItems = tempCart.reduce((total, cartItem) => total + cartItem.itemCount , 0);

				newOrder = await Order.findOneAndUpdate({ accountId, tableId, reserveToken }, { $set: { tempCart, tempTotalPrice, tempTotalItems } }, { new: true, upsert: true }).lean();
				return newOrder;
			} else {
				throw new Error("Order not found.")
			}
		}
	},
	removeTempCartMenuItems: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const account = await Account.findOne({ _id: accountId }).lean();
			if (!account || account.status !== "enabled") {
				throw new Error("Account not active now.");
			}
			const order = await Order.findOne({ accountId, tableId, reserveToken }).lean();

			let newOrder;
			if (order) {
				const tempCart = order.tempCart;
				tempCart.forEach((menuItemData, index) => {
					if (menuItemData.itemCount > 0) {
						menuItemData.movements.push({
							type: "removeFromTempCart",
							count: -(menuItemData.itemCount),
							date: Date.now(),
						})
						tempCart[index] = {
							...menuItemData,
							itemCount: 0,
							itemTotalPrice: 0,
							movements: menuItemData.movements,
						};
					}
				});

				newOrder = await Order.findOneAndUpdate({ accountId, tableId, reserveToken }, { $set: { tempCart, tempTotalPrice: 0, tempTotalItems: 0 } }, { new: true, upsert: true }).lean();
				return newOrder;
			} else {
				throw new Error("Order not found.")
			}
		}
	},
	addOrder: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const account = await Account.findOne({ _id: accountId }).lean();
			if (!account || account.status !== "enabled") {
				throw new Error("Account not active now.");
			}

			const order = await Order.findOne({ accountId, tableId, reserveToken, isPaid: false }).lean();
			let newOrder;
			if (order) {
				let cart = order.cart;
				let tempCart = order.tempCart;
				const orderList = tempCart.reduce((tempCartItemList, tempItemData) => {
					if (tempItemData.itemCount > 0) {
						tempCartItemList.push({ menuItemId: tempItemData.menuItemId, itemCount: tempItemData.itemCount })
					}
					return tempCartItemList;
				}, []);
				if (!(orderList.length > 0)) {
					throw new Error("Your cart is empty. Please add some items before order.")
				}
				const menuItemIds = orderList.map(item => item.menuItemId);

				const foundMenuItems = await MenuItem.find({ accountId, _id: {"$in": menuItemIds }}).lean();
				if (foundMenuItems.length !== menuItemIds.length) {
					throw new Error("Not all menuItems exists.")
				}
				let cartSize = order.cart.length;
				orderList.forEach(itemData => {
					const cartItemIndex = cart.findIndex((cartItem) => {
						return cartItem.menuItemId === itemData.menuItemId;
					});
					const tempCartItemIndex = tempCart.findIndex((tempCartItem) => {
						return tempCartItem.menuItemId === itemData.menuItemId;
					})
					if (cartItemIndex >= 0) {
						cart[cartItemIndex].itemCount += itemData.itemCount;
						cart[cartItemIndex].itemTotalPrice = cart[cartItemIndex].itemCount * cart[cartItemIndex].itemPrice;
					} else {
						const menuItemData = foundMenuItems.find(item => item._id === itemData.menuItemId);
						cart[cartSize++] = {
							menuItemId: itemData.menuItemId,
							itemCount: itemData.itemCount,
							itemName: menuItemData.name,
							img: menuItemData.img,
							itemPrice: menuItemData.price,
							itemTotalPrice: itemData.itemCount * menuItemData.price,
							currency: menuItemData.currency,
							date: Date.now()
						};

					}
					tempCart[tempCartItemIndex].movements.push({
						type: 'addToOrder',
						count: itemData.itemCount,
						date: Date.now(),
					})
					tempCart[tempCartItemIndex].itemCount -= itemData.itemCount;
					tempCart[tempCartItemIndex].itemTotalPrice = tempCart[tempCartItemIndex].itemCount * tempCart[tempCartItemIndex].itemPrice;
				});
				const totalPrice = cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const totalItems = cart.reduce((total, cartItem) => total + cartItem.itemCount , 0);
				const tempTotalPrice = tempCart.reduce((total, cartItem) => total + cartItem.itemTotalPrice , 0);
				const tempTotalItems = tempCart.reduce((total, cartItem) => total + cartItem.itemCount , 0);
				newOrder = await Order.findOneAndUpdate({ accountId, tableId, reserveToken }, { $set: { tempCart, cart, totalPrice, totalItems, tempTotalPrice, tempTotalItems } }, { new: true, upsert: true }).lean();
				return newOrder;
			} else {
				throw new Error("You must add some items to cart before order.");
			}
		}
	},
	reduceOneMenuItemCount: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
			menuItemId: { type: GraphQLInt },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken, menuItemId } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const allowedDateFrom = Date.now() - configs.orderEditDuration;
			const order = await Order.findOne({ accountId, tableId, reserveToken, isPaid: false, cart: { $elemMatch: { menuItemId } } }).lean();
			if (order) {
				order.cart = order.cart.reduce((newCart, cartItem) => {
					const tempCartItemIndex = order.tempCart.findIndex(tempCartItem => tempCartItem.menuItemId === cartItem.menuItemId);
					if (cartItem.menuItemId === menuItemId && cartItem.itemCount > 0 && cartItem.date > allowedDateFrom) {
						cartItem.itemCount--;
						cartItem.itemTotalPrice -= cartItem.itemPrice;
						order.tempCart[tempCartItemIndex].movements.push({
							type: "removeMenuItem",
							count: -1,
							date: Date.now(),
						})
					} else if (cartItem.menuItemId === menuItemId && cartItem.itemCount > 0) {
						throw new Error("Menu item edit time expired.");
					}
					return newCart;
				}, order.cart).filter(cartItem => cartItem.itemCount > 0);
				order.totalPrice = order.cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice, 0);
				order.totalItems = order.cart.reduce((total, cartItem) => total + cartItem.itemCount, 0);
				const { _id, ...newOrder } = order;
				const updatedOrder = await Order.findOneAndUpdate({ _id }, newOrder, { new: true }).lean();
				return updatedOrder;
			} else {
				throw new Error("Order doesn't exists for your reservation or not found menu item in cart with specified id.");
			}
		}
	},
	removeMenuItemFromOrder: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
			menuItemId: { type: GraphQLInt },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken, menuItemId } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const allowedDateFrom = Date.now() - configs.orderEditDuration;
			const order = await Order.findOne({ accountId, tableId, reserveToken, cart: { $elemMatch: { menuItemId } } }).lean();
			if (order) {
				const menuItemInCart = order.cart.find(cartItem => cartItem.menuItemId === menuItemId);
				if (menuItemInCart && menuItemInCart.date > allowedDateFrom) {
					const tempCartItemIndex = order.tempCart.findIndex(tempCartItem => tempCartItem.menuItemId === menuItemInCart.menuItemId);
					order.tempCart[tempCartItemIndex].movements.push({
						type: "removeMenuItem",
						count: menuItemInCart.itemCount,
						date: Date.now(),
					})
					order.cart = order.cart.filter(cartItem => cartItem.menuItemId !== menuItemId && cartItem.itemCount > 0);
					order.totalPrice = order.cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice, 0);
					order.totalItems = order.cart.reduce((total, cartItem) => total + cartItem.itemCount, 0);
					const { _id, ...newOrder } = order;
					const updatedOrder = await Order.findOneAndUpdate({ _id }, newOrder, { new: true }).lean();
					return updatedOrder;
				} else {
					throw new Error("Menu item edit time expired.");
				}
			} else {
				throw new Error("Order doesn't exists for your reservation or not found menu item in cart with specified id.");
			}
		}
	},
	removeCartItemsFromOrder: {
		type: OrderType,
		args: {
			accountId: { type: GraphQLString },
			tableId: { type: GraphQLString },
			reserveToken: { type: GraphQLString },
		},
		async resolve(parent, args){
			let { accountId, tableId, reserveToken } = args;
			accountId = toObjectId(accountId);
			tableId = toObjectId(tableId);
			const allowedDateFrom = Date.now() - configs.orderEditDuration;
			const order = await Order.findOne({ accountId, tableId, reserveToken }).lean();
			if (order && order.cart && order.cart.length > 0) {
				const cartLength = order.cart.length;
				order.cart = order.cart.reduce((newCart, cartItem) => {
					const tempCartItemIndex = order.tempCart.findIndex(tempCartItem => tempCartItem.menuItemId === cartItem.menuItemId);
					if (cartItem.date < allowedDateFrom) {
						newCart.push(cartItem)
						order.tempCart[tempCartItemIndex].movements.push({
							type: "removeMenuItem",
							count: cartItem.itemCount,
							date: Date.now(),
						})
					}
					return newCart;
				}, []);
				if (order.cart.length !== cartLength) {
					order.totalPrice = order.cart.reduce((total, cartItem) => total + cartItem.itemTotalPrice, 0);
					order.totalItems = order.cart.reduce((total, cartItem) => total + cartItem.itemCount, 0);
					const { _id, ...newOrder } = order;
					const updatedOrder = await Order.findOneAndUpdate({ _id }, newOrder, { new: true }).lean();
					return updatedOrder;
				} else {
					throw new Error("Order cart is empty or all menu items edit time expired..");
				}
			} else {
				throw new Error("Order doesn't exists for your reservation or cart is empty.");
			}
		}
	},
}

module.exports = {
	OrderType,
	OrderMutations
}