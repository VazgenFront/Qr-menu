import { useMutation } from "@apollo/client";
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  MAKE_ORDER,
  REDUCE_MENU_ITEM_COUNT,
  REMOVE_CART_ITEM,
} from "../../queries/queries";
import { ThemeContext } from "../../context/ThemeContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../Spinner/Spinner";
import "./CardItem.css";

const CardItem = ({ item, index, navbarTitleColor, navbarBgColor }) => {
  const { cafeId, tableId } = useParams();
  const state = useContext(ThemeContext);
  const [error, setError] = useState({ hasError: false, errorMessage: "" });

  const [addOrder] = useMutation(MAKE_ORDER);

  const [reduceItem, { error: reduceItemError }] = useMutation(
    REDUCE_MENU_ITEM_COUNT
  );

  const [
    removeCartItem,
    { loading: loadingRemovueCartItem, error: removueCartItemError },
  ] = useMutation(REMOVE_CART_ITEM);

  const [count, setCount] = useState(item.itemCount);
  const [price, setPrice] = useState(item.itemTotalPrice);

  const addToCard = async (id, type) => {
    const menuItemId = id;
    const serverCafeId = cafeId;
    const serverTableId = tableId;

    return addOrder({
      variables: {
        accountId: Number(serverCafeId),
        tableId: Number(serverTableId),
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    })
      .then((data) => data.data?.addOrder?.totalItems)
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
      });
  };

  const reduceItemFromCart = async (id) => {
    const menuItemId = Number(id);
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);

    return reduceItem({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        menuItemId: menuItemId,
      },
    })
      .then((data) => data.data?.reduceOneMenuItemCount?.totalItems)
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
      });
  };

  const removeCartItemFromCart = async (id) => {
    const menuItemId = Number(id);
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);

    return removeCartItem({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        menuItemId: menuItemId,
      },
    })
      .then((data) => data.data?.removeMenuItemFromOrder?.totalItems)
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
      });
  };

  const onAdd = async (itm) => {
    const totalItemsCount = await addToCard(itm.menuItemId);
    state.getTotalItemsCount(totalItemsCount);
    setCount((prevState) => prevState + 1);
    setPrice((prevState) => prevState + itm.itemPrice);
  };

  const onReduce = async (itm) => {
    if (count <= 1) {
      return;
    } else {
      const totalItemsCount = await reduceItemFromCart(itm.menuItemId);
      state.getTotalItemsCount(totalItemsCount);
      setCount((prevState) => prevState - 1);
      setPrice((prevState) => prevState - itm.itemPrice);
    }
  };

  const onRemoveItem = async (itm) => {
    const totalItemsCount = await removeCartItemFromCart(itm.menuItemId);
    state.getTotalItemsCount(totalItemsCount);
  };

  if (loadingRemovueCartItem) {
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

  if (!count || !price) {
    return null;
  }

  console.log("error", error);

  return (
    <>
      {count && price ? (
        <div
          className="cart__item"
          key={index}
          style={{ border: `4px solid ${navbarTitleColor}` }}
        >
          <img src={item.img} alt="img" className="cart__item__img" />
          <div className="cart__item__info">
            <span
              className="cart__item__name"
              style={{ color: navbarTitleColor }}
            >
              {item?.itemName}
            </span>
            <div className="cart__item__count">
              <div>
                <button
                  className="cart__item__btn"
                  onClick={() => onReduce(item)}
                >
                  -
                </button>
                <span
                  className="item__count"
                  style={{ color: navbarTitleColor }}
                >
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
      ) : null}
    </>
  );
};

export default CardItem;
