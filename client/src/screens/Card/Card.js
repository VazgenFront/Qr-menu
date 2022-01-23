import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardItem from "../../components/CardItem/CardItem";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Spinner from "../../components/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_ORDER, REMOVE_ALL_CART_ITEMS } from "../../queries/queries";
import "./Card.css";

const Card = () => {
  const { tableId, cafeId } = useParams();
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  const state = useContext(ThemeContext);

  const [getOrder, { loading, data, error }] = useLazyQuery(GET_ORDER);

  const [removeAllItems, { data: dt }] = useMutation(REMOVE_ALL_CART_ITEMS);

  const { navbarTitleColor, navbarBgColor } = state.styles;

  const onDeleteAllItems = () => {
    removeAllItems({
      variables: {
        accountId: Number(cafeId),
        tableId: Number(tableId),
        reserveToken: token,
      },
    }).then(() => setCart([]));
  };

  useEffect(() => {
    getOrder({
      variables: {
        accountId: Number(cafeId),
        tableId: Number(tableId),
        reserveToken: token,
      },
    }).then((data) => setCart(() => [...data?.data?.order?.cart]));
  }, [cafeId, data, getOrder, tableId, token]);

  if (loading) {
    return <Spinner color={navbarTitleColor} />;
  }

  if (error) {
    return <ErrorMessage error={error?.message} color={navbarTitleColor} />;
  }
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
      {cart.length > 0 ? (
        cart.map((item, index) => (
          <CardItem
            key={index}
            item={item}
            index={index}
            navbarTitleColor={navbarTitleColor}
          />
        ))
      ) : (
        <span className="emptyCart__title" style={{ color: navbarTitleColor }}>
          Yout Cart is Empty
        </span>
      )}

      {cart.length > 0 && Buttons()}
    </div>
  );

  function Buttons() {
    return (
      <div className="cart__btns">
        <button
          className="order__btn"
          style={{ background: navbarTitleColor }}
          onClick={onDeleteAllItems}
        >
          Cancel
        </button>
        <button className="order__btn" style={{ background: navbarTitleColor }}>
          Order
        </button>
      </div>
    );
  }
};

export default Card;
