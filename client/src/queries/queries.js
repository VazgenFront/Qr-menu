import { gql } from "@apollo/client";

export const GET_CAFFEE = gql`
  query account($_id: String!) {
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
      mainDishes {
        type
        menuItemsCount
        mainItems {
          _id
          accountId
          name
          description
          img
          price
          currency
          isMainDish
        }
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

export const GET_TABLE_TOKEN = gql`
  mutation reserveTable($accountId: String!, $tableId: String!) {
    reserveTable(accountId: $accountId, tableId: $tableId) {
      reserveToken
    }
  }
`;

export const ADD__TEMP__CARD = gql`
  mutation addToTempCart(
    $accountId: String!
    $tableId: String!
    $reserveToken: String!
    $orderList: [OrderListItemInput]!
  ) {
    addToTempCart(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
      orderList: $orderList
    ) {
      _id
      accountId
      tableId
      tempCart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      cart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      reserveToken
      isPaid
      totalPrice
      totalItems
      tempTotalPrice
      tempTotalItems
      notes
    }
  }
`;

export const GET_ORDER = gql`
  query order($accountId: String!, $tableId: String!, $reserveToken: String!) {
    order(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
    ) {
      tempCart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      cart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      totalPrice
      totalItems
      tempTotalPrice
      tempTotalItems
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
  query menuItemsOfType($accountId: String!, $type: String!) {
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
  mutation reduceFromTempCartOneMenuItem(
    $accountId: String!
    $tableId: String!
    $reserveToken: String!
    $menuItemId: Int!
  ) {
    reduceFromTempCartOneMenuItem(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
      menuItemId: $menuItemId
    ) {
      _id
      accountId
      tableId
      tempCart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      cart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      reserveToken
      isPaid
      totalPrice
      totalItems
      tempTotalPrice
      tempTotalItems
      notes
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation removeFromTempCartMenuItem(
    $accountId: String!
    $tableId: String!
    $reserveToken: String!
    $menuItemId: Int!
  ) {
    removeFromTempCartMenuItem(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
      menuItemId: $menuItemId
    ) {
      _id
      accountId
      tableId
      tempCart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      cart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      reserveToken
      isPaid
      totalPrice
      totalItems
      tempTotalPrice
      tempTotalItems
      notes
    }
  }
`;

export const REMOVE_ALL_CART_ITEMS = gql`
  mutation removeTempCartMenuItems(
    $accountId: String!
    $tableId: String!
    $reserveToken: String!
  ) {
    removeTempCartMenuItems(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
    ) {
      _id
      accountId
      tableId
      tempCart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      cart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      reserveToken
      isPaid
      totalPrice
      totalItems
      tempTotalPrice
      tempTotalItems
      notes
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder(
    $accountId: String!
    $tableId: String!
    $reserveToken: String!
  ) {
    addOrder(
      accountId: $accountId
      tableId: $tableId
      reserveToken: $reserveToken
    ) {
      accountId
      tableId
      tempCart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
      }
      cart {
        menuItemId
        itemName
        img
        itemCount
        itemPrice
        itemTotalPrice
        currency
        date
      }
      reserveToken
      isPaid
      totalPrice
      totalItems
      tempTotalPrice
      tempTotalItems
      notes
    }
  }
`;

export const SEARCH_ITEM = gql`
  query searchMenuItem($accountId: String!, $namePart: String!) {
    searchMenuItem(accountId: $accountId, namePart: $namePart) {
      _id
      accountId
      name
      img
      price
      currency
      isMainDish
      description
    }
  }
`;
