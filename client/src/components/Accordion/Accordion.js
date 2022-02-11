import { useState } from "react";
import "./Accordion.css";

export const Accordion = ({ title, cart, navbarTitleColor }) => {
  const [isOpen, setOpen] = useState(true);
  return (
    <div
      className="accordion-wrapper"
      style={{
        padding: "20px",
      }}
    >
      <div
        className={`accordion-title ${isOpen ? "open" : ""}`}
        style={{ color: navbarTitleColor }}
        onClick={() => setOpen(!isOpen)}
      >
        {title}
      </div>
      <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
        {cart.map((item, index) => (
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
                <span style={{ color: navbarTitleColor }}>
                  1/{item.itemPrice} {item.price} {item.currency}
                </span>
                <span style={{ color: navbarTitleColor }}>
                  quant. {item.itemCount}
                </span>
                <span style={{ color: navbarTitleColor }}>
                  {item.itemTotalPrice} {item.price} {item.currency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
