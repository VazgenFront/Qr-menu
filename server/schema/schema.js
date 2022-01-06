const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require("graphql");
const Account = require("../db/models/account");
const Style = require("../db/models/style");
const MenuItem = require("../db/models/menuItem");
const Order = require("../db/models/order");
const Table = require("../db/models/table");
const {AccountType, AccountMutations} = require("./accountSchemas");
const {StyleType, StyleMutations} = require("./styleSchemas");
const {MenuItemType, MenuItemMutations} = require("./menuItemSchemas");
const {OrderType, OrderMutations} = require("./orderSchemas");
const {TableType, TableMutations} = require("./tableSchemas");

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    account: {
      type: AccountType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        const _id = args._id;
        const account = Account.findOne({ _id }, { stylesId: 0 }).lean();
        return account;
      },
    },
    style: {
      type: StyleType,
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const _id = args._id;
        const style = await Style.findOne({_id}).lean();
        return style
      }
    },
    menuItem: {
      type: MenuItemType,
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const _id = args._id;
        const menuItem = await MenuItem.findOne({_id}).lean();
        return menuItem;
      }
    },
    menuItemsOfType: {
      type: new GraphQLList(MenuItemType),
      args: { accountId: { type: GraphQLID }, type: { type: GraphQLString } },
      async resolve(parent, args) {
        const { accountId, type } = args;
        const menuItems = await MenuItem.find({ accountId, type }).lean();
        return menuItems;
      }
    },
    order: {
      type: OrderType,
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const _id = args._id;
        const order = await Order.findOne({_id}).lean();
        return order;
      }
    },
    table: {
      type: TableType,
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const _id = args._id;
        const table = await Table.findOne({_id}).lean();
        return table;
      }
    },
    accountTable: {
      type: TableType,
      args: { accountId: { type: GraphQLID }, tableId: { type: GraphQLID } },
      async resolve(parent, args) {
        const { accountId, tableId } = args;
        const table = await Table.findOne({ accountId, tableId }).lean();
        return table;
      }
    },
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...AccountMutations,
    ...StyleMutations,
    ...MenuItemMutations,
    ...OrderMutations,
    ...TableMutations,
  }),
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})