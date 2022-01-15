import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MAKE_ORDER } from "../../queries/queries";
import "./CardItem.css";

const CardItem = ({ item, index, navbarTitleColor }) => {
  const { cafeName, cafeId, tableId } = useParams();

  const [
    addOrder,
    { loading: loadingAddOrder, data: addOrderData, error: addOrderDataError },
  ] = useMutation(MAKE_ORDER);

  const [count, setCount] = useState(item.itemCount);
  const [price, setPrice] = useState(item.itemTotalPrice);
  const [deleted, setDeleted] = useState(false);

  const addToCard = (id, type) => {
    const menuItemId = Number(id);

    addOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    });
  };

  const onAdd = (itm) => {
    addToCard(itm.menuItemId);
    setCount((prevState) => prevState + 1);
    setPrice((prevState) => prevState + itm.itemPrice);
  };

  const onRemove = (itm) => {
    if (count <= 1) {
      return;
    }
    setCount((prevState) => prevState - 1);
    setPrice((prevState) => prevState - itm.itemPrice);
    addToCard(itm.menuItemId);
  };

  const onDelete = (item) => {
    setDeleted(!deleted);
  };

  if (deleted) {
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
            <button className="cart__item__btn" onClick={() => onRemove(item)}>
              -
            </button>
            <span className="item__count">{count}</span>
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
        onClick={onDelete}
      >
        X
      </span>
    </div>
  );
};

export default CardItem;
