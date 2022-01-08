import React from "react";
import "./BuyingInfo.css";

const BuyingInfo = ({ navbarTitleColor, item, addToCard }) => {
  return (
    <div className="buying__info">
      <span
        className="cafeInfo__menuItem__price"
        style={{ color: navbarTitleColor }}
      >
        {item?.price} AMD
      </span>
      <button
        className="add__card_button"
        style={{ background: navbarTitleColor }}
        onClick={() => addToCard(item?._id)}
      >
        Buy
      </button>
    </div>
  );
};

export default BuyingInfo;
