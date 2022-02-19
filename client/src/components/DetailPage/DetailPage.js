import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD__TEMP__CARD } from "../../queries/queries";
import "./style.css";

const DetailPage = ({
  selectedItem,
  setDetailIsOpen,
  detilIsOpen,
  cafeId,
  tableId,
}) => {
  const closeDetail = () => {
    setDetailIsOpen(false);
  };

  const [count, setCount] = useState(1);

  const addToCard = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const removeFromCart = () => {
    if (count <= 1) {
      return;
    }

    setCount((prevCount) => prevCount - 1);
  };

  const [addOrder] = useMutation(ADD__TEMP__CARD);

  const addToTempCart = async () => {
    addOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: selectedItem._id, itemCount: count }],
      },
    });
  };

  return (
    <div className={detilIsOpen ? "detail_page__show" : "detail_page__show"}>
      <div
        className="detail_page_img"
        style={{ backgroundImage: `url(${selectedItem.img})` }}
      >
        <div className="closeButton_wrapper" onClick={closeDetail}>
          x
        </div>
      </div>
      <div className="detailed__info">
        <span className="detailed__title">{selectedItem.name}</span>
        <span className="detailed__price">
          {selectedItem.price} {selectedItem.currency}
        </span>
      </div>
      <div className="detailed__des">{selectedItem.description}</div>

      <div className="order__cancel_wrapper">
        <div className="minus_box" onClick={removeFromCart}>
          -
        </div>
        <div className="count_box">{count}</div>
        <div className="plus_box" onClick={addToCard}>
          +
        </div>
      </div>

      <div className="preorder_box">
        <button className="preorder__btn" onClick={addToTempCart}>
          Pre-order
        </button>
      </div>
    </div>
  );
};

export default DetailPage;
