import axios from "axios";
import React, { useEffect, useState } from "react";
import { Accordion } from "./Accordion";
import "./AdminPanelHome.css";

const AdminPanelHome = () => {
  const token = localStorage.getItem("adminTkn");

  const [orders, setOrders] = useState([]);

  const getOrdersData = async () => {
    await axios
      .get("http://localhost:4000/api/account/orders/unpaid", {
        headers: { "x-access-token": token },
      })
      .then((data) => {
        setOrders(() => [...data.data.orders]);
      });
    // .catch((e) => {
    //   window.location = "/admin-panel/auth";
    // });
  };

  useEffect(async () => {
    await getOrdersData();
  }, []);

  const finalOrder = orders.filter(
    (item) => item.totalItems || item.tempTotalItems > 0
  );

  return (
    <div className="AdminPanelHome">
      <div className="line"></div>
      <span className="tables__title">Order</span>
      {finalOrder.length ? (
        <div className="order__list">
          {finalOrder.map((item, idx) => (
            <Accordion
              key={idx}
              item={item}
              title={item.tableName}
              cart={item.cart}
              tempCart={item.tempCart}
              setOrders={setOrders}
              from="tables"
            />
          ))}
        </div>
      ) : (
        <span className="no__orders" style={{ marginTop: "40px" }}>
          No orders yet
        </span>
      )}
    </div>
  );
};

export default AdminPanelHome;
