import React, { useState } from "react";
import "./AdminPanelHome.css";
import axios from "axios";
export const Accordion = ({ title, cart, tempCart, item, setOrders }) => {
  const [isOpen, setOpen] = useState(false);
  const token = localStorage.getItem("adminTkn");

  const closeOrder = () => {
    axios.post(
      "http://localhost:4000/api/account/closeTable",
      { tableId: item.tableId },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    setOpen(false);
    setOrders([]);
  };

  const finalTempCart = tempCart.filter((item) => item.itemCount > 0);
  const finalCart = cart.filter((item) => item.itemCount > 0);

  return (
    <div className="accordion-wrapper-order">
      <div
        className={`accordion-title ${isOpen ? "open" : ""}`}
        onClick={() => setOpen(!isOpen)}
      >
        {title}
      </div>
      <div className={`accordion-item-cart ${!isOpen ? "collapsed" : ""}`}>
        <>
          {finalCart.length ? (
            <>
              {isOpen ? <span>Ordered</span> : null}
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>name</th>
                    <th>quantity</th>
                    <th>price per one</th>
                    <th>total Count</th>
                  </tr>
                </thead>
                <tbody>
                  {finalCart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{item.itemCount}</td>
                      <td>{item.itemPrice}</td>
                      <td>{item.itemTotalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </>
        <>
          {finalTempCart.length ? (
            <>
              {isOpen ? <span>Want to order</span> : null}
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>name</th>
                    <th>quantity</th>
                    <th>price per one</th>
                    <th>total Count</th>
                  </tr>
                </thead>
                <tbody>
                  {finalTempCart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{item.itemCount}</td>
                      <td>{item.itemPrice}</td>
                      <td>{item.itemTotalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </>
        <button className="btn close" onClick={closeOrder}>
          Close Order
        </button>
      </div>
    </div>
  );
};
