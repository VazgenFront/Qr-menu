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
        url
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
