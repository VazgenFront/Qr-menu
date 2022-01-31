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
  const [totalPrice, setToTalItemsPrice] = useState(0);
  const [error, setError] = useState({ hasError: false, errorMessage: "" });

  const [getOrder, { loading, data }] = useLazyQuery(GET_ORDER);

  const [removeAllItems] = useMutation(REMOVE_ALL_CART_ITEMS);
  const { getTotalItemsCount } = state;
  const { navbarTitleColor, navbarBgColor } = state.styles;

  const onDeleteAllItems = () => {
    removeAllItems({
      variables: {
        accountId: Number(cafeId),
        tableId: Number(tableId),
        reserveToken: token,
      },
    })
      .then(() => setCart([]))
      .then(() => getTotalItemsCount())
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
      });
  };

  useEffect(() => {
    getOrder({
      variables: {
        accountId: Number(cafeId),
        tableId: Number(tableId),
        reserveToken: token,
      },
    })
      .then((data) => {
        setToTalItemsPrice(data?.data?.order?.totalPrice);
        return data?.data?.order && setCart(() => [...data?.data?.order?.cart]);
      })
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
      });
  }, [cafeId, data, getOrder, tableId, token]);

  if (loading) {
    return <Spinner color={navbarTitleColor} />;
  }
  
  if (error.errorMessage) {
    return (
      <ErrorMessage
        color={navbarTitleColor}
        background={navbarBgColor}
        error={"Something Went Wrong"}
      />
    );
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
            navbarBgColor={navbarBgColor}
          />
        ))
      ) : (
        <span className="emptyCart__title" style={{ color: navbarTitleColor }}>
          Yout Cart is Empty
        </span>
      )}

      {totalPrice ? (
        <span className="totalItems__price">Total Price: {totalPrice} AMD</span>
      ) : null}
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
