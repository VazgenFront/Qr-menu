import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import "./Card.css";
import { GET_ORDER } from "../../queries/queries";
const Card = () => {
  const { tableId } = useParams();

  const { loading, data, error } = useQuery(GET_ORDER, {
    variables: { _id: tableId },
  });

  const cart = data?.order?.cart;

  console.log("cart", cart);
  return (
    <div className="card_box">
      <span className="card__title">MY CART</span>
    </div>
  );
};

export default Card;
