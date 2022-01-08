import { gql } from "@apollo/client";

export const GET_CAFFEE = gql`
  query account($_id: ID!) {
    account(_id: $_id) {
      _id
      username
      password
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
  mutation reserveTable($accountId: ID!, $tableId: ID!) {
    reserveTable(accountId: $accountId, tableId: $tableId) {
      reserveToken
    }
  }
`;

export const MAKE_ORDER = gql`
  mutation addOrder(
    $accountId: ID!
    $tableId: ID!
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
    }
  }
`;

export const GET_ORDER = gql`
  query order($_id: ID!) {
    order(_id: $_id) {
      accountId
      tableId
      reserveToken
      cart {
        menuItemId
        itemCount
      }
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
  query menuItemsOfType($accountId: ID!, $type: String!) {
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
