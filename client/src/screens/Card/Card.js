import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import "./Card.css";
import { GET_ORDER } from "../../queries/queries";
const Card = () => {
  const { tableId, cafeId } = useParams();
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState([]);

  
  const { loading, data, error } = useQuery(GET_ORDER, {
    variables: { accountId: cafeId, tableId: tableId, reserveToken: token },
  });

  console.log("data", data?.order);

  useEffect(() => {
    // setCart(() => [data]);
  }, []);

  console.log("cart", cart);
  return (
    <div className="card_box">
      <span className="card__title">MY CART</span>
    </div>
  );
};

export default Card;
