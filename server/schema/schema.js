const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require("graphql");
const Account = require("../db/models/account");
const MenuItem = require("../db/models/menuItem");
const Order = require("../db/models/order");
const Table = require("../db/models/table");
const { AccountType } = require("./accountSchemas");
const { MenuItemType } = require("./menuItemSchemas");
const { OrderType, OrderMutations } = require("./orderSchemas");
const { TableType, TableMutations } = require("./tableSchemas");
const { toObjectId } = require("../helpers/conversions");

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    account: {
      type: AccountType,
      args: { _id: { type: GraphQLString } },
      async resolve(parent, args) {
        const _id = args._id;
        const account = await Account.findOne({ _id }, { password: 0 }).lean();
        return account;
      },
    },
    menuItem: {
      type: MenuItemType,
      args: { _id: { type: GraphQLInt } },
      async resolve(parent, args) {
        const _id = args._id;
        const menuItem = await MenuItem.findOne({_id}).lean();
        return menuItem;
      }
    },
    menuItemsOfType: {
      type: new GraphQLList(MenuItemType),
      args: { accountId: { type: GraphQLString }, type: { type: GraphQLString } },
      async resolve(parent, args) {
        const { accountId, type } = args;
        const menuItems = await MenuItem.find({ accountId, type }).lean();
        return menuItems;
      }
    },
    order: {
      type: OrderType,
      args: {
        accountId: { type: GraphQLString },
        tableId: { type: GraphQLString },
        reserveToken: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let { accountId, tableId, reserveToken } = args;
        accountId = toObjectId(accountId);
        tableId = toObjectId(tableId);
        const order = await Order.findOne({ accountId, tableId, reserveToken }).lean();
        order.tempCart = order.tempCart.filter(tempCartItem => tempCartItem.itemCount > 0);
        return order;
      }
    },
    accountTable: {
      type: TableType,
      args: {
        accountId: { type: GraphQLString },
        tableId: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { accountId, tableId } = args;
        const table = await Table.findOne({ accountId, tableId }, { reserveToken: 0 }).lean();
        return table;
      }
    },
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...OrderMutations,
    ...TableMutations,
  }),
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})