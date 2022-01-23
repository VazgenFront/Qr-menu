import { useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  MAKE_ORDER,
  REDUCE_MENU_ITEM_COUNT,
  REMOVE_CART_ITEM,
} from "../../queries/queries";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../Spinner/Spinner";
import "./CardItem.css";

const CardItem = ({ item, index, navbarTitleColor }) => {
  const { cafeId, tableId } = useParams();

  const [addOrder, { loading: loadingAddOrder, error: addOrderDataError }] =
    useMutation(MAKE_ORDER);

  const [reduceItem, { loading: loadingReduceItem, error: reduceItemError }] =
    useMutation(REDUCE_MENU_ITEM_COUNT);

  const [
    removeCartItem,
    { loading: loadingRemovueCartItem, error: removueCartItemError },
  ] = useMutation(REMOVE_CART_ITEM);

  const [count, setCount] = useState(item.itemCount);
  const [price, setPrice] = useState(item.itemTotalPrice);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    console.log("hello");
  }, [price, count, deleted]);

  const addToCard = (id, type) => {
    const menuItemId = Number(id);
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);

    addOrder({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    });
  };

  const reduceItemFromCart = (id) => {
    const menuItemId = Number(id);
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);

    reduceItem({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        menuItemId: menuItemId,
      },
    });
  };

  const removeCartItemFromCart = (id) => {
    const menuItemId = Number(id);
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);

    removeCartItem({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        menuItemId: menuItemId,
      },
    });
  };

  const onAdd = (itm) => {
    addToCard(itm.menuItemId);
    setCount((prevState) => prevState + 1);
    setPrice((prevState) => prevState + itm.itemPrice);
  };

  const onReduce = (itm) => {
    if (count <= 1) {
      return;
    } else {
      reduceItemFromCart(itm.menuItemId);
      setCount((prevState) => prevState - 1);
      setPrice((prevState) => prevState - itm.itemPrice);
    }
  };

  const onRemoveItem = (itm) => {
    removeCartItemFromCart(itm.menuItemId);
    setCount(0);
    setPrice(0);
  };

  if (deleted) {
    return null;
  }

  if (loadingRemovueCartItem) {
    return <Spinner color={navbarTitleColor} />;
  }

  if (reduceItemError || removueCartItemError || addOrderDataError) {
    return (
      <ErrorMessage
        color={navbarTitleColor}
        error={
          reduceItemError?.message ||
          removueCartItemError?.message ||
          addOrderDataError?.message
        }
      />
    );
  }

  if (!count || !price) {
    return null;
  }

  return (
    <div
      className="cart__item"
      key={index}
      style={{ border: `4px solid ${navbarTitleColor}` }}
    >
      <img src={item.img} alt="img" className="cart__item__img" />
      <div className="cart__item__info">
        <span className="cart__item__name" style={{ color: navbarTitleColor }}>
          {item?.itemName}
        </span>
        <div className="cart__item__count">
          <div>
            <button className="cart__item__btn" onClick={() => onReduce(item)}>
              -
            </button>
            <span className="item__count" style={{ color: navbarTitleColor }}>
              {count}
            </span>
            <button className="cart__item__btn" onClick={() => onAdd(item)}>
              +
            </button>
          </div>
          <span style={{ color: navbarTitleColor }}>
            {price} {item.currency}
          </span>
        </div>
      </div>

      <span
        className="remove"
        style={{ color: navbarTitleColor }}
        onClick={() => onRemoveItem(item)}
      >
        X
      </span>
    </div>
  );
};

export default CardItem;
