import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardItem from "../../components/CardItem/CardItem";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_ORDER } from "../../queries/queries";
import "./Card.css";

const Card = () => {
  const { tableId, cafeId } = useParams();
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  const state = useContext(ThemeContext);

  const [getOrder, { loading, data, error }] = useLazyQuery(GET_ORDER);

  useEffect(() => {
    getOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: token,
      },
    }).then((data) => setCart(() => [...data?.data?.order?.cart]));
  }, [data]);

  const { navbarTitleColor, navbarBgColor, mostBookedBorder } = state.styles;

  loading && <p>Loading...</p>;
  return (
    <div
      className="card_box"
      style={{
        background: navbarBgColor,
      }}
    >
      <span className="card__title" style={{ color: navbarTitleColor }}>
        MY CART
      </span>
      {cart.map((item, index) => (
        <CardItem
          key={index}
          item={item}
          index={index}
          navbarTitleColor={navbarTitleColor}
        />
      ))}

      <div className="cart__btns">
        <button className="order__btn" style={{ background: navbarTitleColor }}>
          Cancel
        </button>
        <button className="order__btn" style={{ background: navbarTitleColor }}>
          Order
        </button>
      </div>
    </div>
  );
};

export default Card;
