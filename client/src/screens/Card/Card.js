import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from "../../components/Accordion/Accordion";
import CardItem from "../../components/CardItem/CardItem";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Spinner from "../../components/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import {
  ADD_ORDER,
  GET_ORDER,
  REMOVE_ALL_CART_ITEMS,
} from "../../queries/queries";
import "./Card.css";

const Buttons = ({
  onDeleteAllItems,
  navbarTitleColor,
  addTempItemsToCart,
}) => {
  return (
    <div className="cart__btns">
      <button
        className="order__btn"
        style={{ background: navbarTitleColor }}
        onClick={onDeleteAllItems}
      >
        Cancel
      </button>
      <button
        className="order__btn"
        style={{ background: navbarTitleColor }}
        onClick={addTempItemsToCart}
      >
        Order
      </button>
    </div>
  );
};

const Card = () => {
  const { tableId, cafeId } = useParams();
  const [tempCart, setTempCart] = useState([]);
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("token");
  const state = useContext(ThemeContext);
  const [totalPrice, setToTalItemsPrice] = useState(0);
  const [error, setError] = useState({ hasError: false, errorMessage: "" });

  const [getOrder, { loading, data }] = useLazyQuery(GET_ORDER);
  const [MAKE_ORDER, { data: makeOrderData }] = useMutation(ADD_ORDER);

  const [removeAllItems] = useMutation(REMOVE_ALL_CART_ITEMS);
  const { getTotalItemsCount } = state;
  const { navbarTitleColor, navbarBgColor } = state.styles;

  const onDeleteAllItems = () => {
    removeAllItems({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: token,
      },
    })
      .then(() => setTempCart([]))
      .then(() => getTotalItemsCount())
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
      });
  };

  const addTempItemsToCart = async () => {
    await MAKE_ORDER({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
      },
    }).catch((e) => {
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
        accountId: cafeId,
        tableId: tableId,
        reserveToken: token,
      },
    })
      .then((data) => {
        setToTalItemsPrice(data?.data?.order?.tempTotalPrice);
        if (data.data?.order) {
          setTempCart(() => [...data?.data?.order?.tempCart]);
          setCart(() => [...data?.data?.order?.cart]);
        }
      })
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
      });
  }, [cafeId, data, tableId, token, makeOrderData]);

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
        <Accordion
          title={"Yet ordered"}
          cart={cart}
          navbarTitleColor={navbarTitleColor}
        />
      ) : null}
      {tempCart.length > 0 ? (
        tempCart.map((item, index) => (
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
          Your Cart is Empty
        </span>
      )}

      {totalPrice ? (
        <span className="totalItems__price">Total Price: {totalPrice} AMD</span>
      ) : null}
      {tempCart.length > 0 && (
        <Buttons
          navbarTitleColor={navbarTitleColor}
          onDeleteAllItems={onDeleteAllItems}
          addTempItemsToCart={addTempItemsToCart}
        />
      )}
    </div>
  );
};

export default Card;
