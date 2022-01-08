import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_ORDER } from "../../queries/queries";
import "./Card.css";
const Card = () => {
  const { tableId, cafeId } = useParams();
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState([]);

  const { loading, data, error } = useQuery(GET_ORDER, {
    variables: { accountId: cafeId, tableId: tableId, reserveToken: token },
  });

  data && console.log("...data?.order?.cart", data?.order?.cart);
  useEffect(() => {
    // data && setCart(() => [...data?.order?.cart]);
  }, []);

  console.log("cart", cart);
  return (
    <div className="card_box">
      <span className="card__title">MY CART</span>
    </div>
  );
};

export default Card;
