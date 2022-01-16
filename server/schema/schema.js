const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require("graphql");
const Account = require("../db/models/account");
const MenuItem = require("../db/models/menuItem");
const Order = require("../db/models/order");
const Table = require("../db/models/table");
const {AccountType, AccountMutations} = require("./accountSchemas");
const {StyleMutations} = require("./styleSchemas");
const {MenuItemType, MenuItemMutations} = require("./menuItemSchemas");
const {OrderType, OrderMutations} = require("./orderSchemas");
const {TableType, TableMutations} = require("./tableSchemas");

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    account: {
      type: AccountType,
      args: { _id: { type: GraphQLInt } },
      resolve(parent, args) {
        const _id = args._id;
        const account = Account.findOne({ _id }, { stylesId: 0 }).lean();
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
      args: { accountId: { type: GraphQLInt }, type: { type: GraphQLString } },
      async resolve(parent, args) {
        const { accountId, type } = args;
        const menuItems = await MenuItem.find({ accountId, type }).lean();
        return menuItems;
      }
    },
    order: {
      type: OrderType,
      args: {
        accountId: { type: GraphQLInt },
        tableId: { type: GraphQLInt },
        reserveToken: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { accountId, tableId, reserveToken } = args;
        const order = await Order.findOne({ accountId, tableId, reserveToken }).lean();
        return order;
      }
    },
    table: {
      type: TableType,
      args: { _id: { type: GraphQLInt } },
      async resolve(parent, args) {
        const _id = args._id;
        const table = await Table.findOne({_id}).lean();
        return table;
      }
    },
    accountTable: {
      type: TableType,
      args: { accountId: { type: GraphQLInt }, tableId: { type: GraphQLInt } },
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