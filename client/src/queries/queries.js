import { gql } from "@apollo/client";

export const GET_CAFFEE = gql`
  query account($_id: Int!) {
    account(_id: $_id) {
      _id
      username
      name
      img
      email
      typeId
      subTypeId
      status
      menuTypes {
        name
      }
      style {
        _id
        navbarBgColor
        navbarTitleColor
        logo
        mostBookedBorder
        fontFamily
      }
      menuItems {
        _id
        type
        name
        description
        img
        price
        currency
      }
    }
  }
`;

export const GET_TABBLE_TOKEN = gql`
  mutation reserveTable($accountId: Int!, $tableId: Int!) {
    reserveTable(accountId: $accountId, tableId: $tableId) {
      reserveToken
    }
  }
`;

export const MAKE_ORDER = gql`
  mutation addOrder(
    $accountId: Int!
    $tableId: Int!
    $reserveToken: String!
    $orderList: [OrderListItemInput]!
  ) {
    addOrder(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
      orderList: $orderList
    ) {
      _id
      accountId
      tableId
      reserveToken
      isPaid
      notes
      cart {
        menuItemId
        itemCount
      }
      totalItems
      totalPrice
    }
  }
`;

export const GET_ORDER = gql`
  query order($accountId: Int!, $tableId: Int!, $reserveToken: String!) {
    order(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
    ) {
      cart {
        menuItemId
        itemCount
        itemPrice
        itemTotalPrice
        currency
        date
        itemName
        img
      }
      totalItems
      totalPrice
    }
  }
`;

export const GET_MENU_ITEM = gql`
  query menuItem($_id: ID!) {
    menuItem(_id: $_id) {
      _id
      type
      name
      description
      img
      price
      currency
      isMainDish
    }
  }
`;

export const GET_MENUTYPE_INFO = gql`
  query menuItemsOfType($accountId: Int!, $type: String!) {
    menuItemsOfType(accountId: $accountId, type: $type) {
      _id
      type
      name
      description
      img
      price
      currency
      isMainDish
    }
  }
`;

export const REDUCE_MENU_ITEM_COUNT = gql`
  mutation reduceOneMenuItemCount(
    $accountId: Int!
    $tableId: Int!
    $reserveToken: String!
    $menuItemId: Int!
  ) {
    reduceOneMenuItemCount(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
      menuItemId: $menuItemId
    ) {
      _id
      accountId
      tableId
      reserveToken
      isPaid
      totalPrice
      totalItems
      notes
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation removeMenuItemFromOrder(
    $accountId: Int!
    $tableId: Int!
    $reserveToken: String!
    $menuItemId: Int!
  ) {
    removeMenuItemFromOrder(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
      menuItemId: $menuItemId
    ) {
      __typename
      totalPrice
      totalItems
    }
  }
`;

export const REMOVE_ALL_CART_ITEMS = gql`
  mutation removeCartItemsFromOrder(
    $accountId: Int!
    $tableId: Int!
    $reserveToken: String!
  ) {
    removeCartItemsFromOrder(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
    ) {
      __typename
    }
  }
`;
