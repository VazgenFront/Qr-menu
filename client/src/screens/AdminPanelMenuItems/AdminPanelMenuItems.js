import axios from "axios";
import React, { useState, useEffect } from "react";
import "./AdminPanelMenuItems.css";
import search from "./search.png";

const AdminPanelMenuItems = () => {
  const [allItems, setAllItems] = useState([]);

  const token = localStorage.getItem("adminTkn");

  useEffect(async () => {
    await axios
      .get("http://localhost:4000/api/account/menuItems", {
        headers: { "x-access-token": token },
      })
      .then((data) => {
        setAllItems(() => [...data.data.menuItems]);
      });
    // .catch((e) => {
    //   window.location = "/admin-panel/auth";
    // });
  }, []);


  return (
    <div className="AdminPanelMenuItems">
      <div className="line"></div>
      <div className="menuTypes_info__box">
        <div className="menuTypes__text__box">
          <span className="admin__title">All Items</span>
          <span className="admin__text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </span>
          <div className="searchInput">
            <input type="text" className="search__item" />
            <img src={search} alt="img" className="search__img" />
          </div>
        </div>
        <div className="addMenuType">+</div>
      </div>
      <div className="menuItems">
        {allItems.map((item, idx) => (
          <div className="menuItem_item" key={idx}>
            <div className="menuItm">
              {item.isMainDish ? (
                <div className="mainDish">MAIN DISH</div>
              ) : null}
              <img className="menuType__img" src={item.img} alt="img" />
              <span className="type">
                Name: <span className="tpe__server">{item.name}</span>{" "}
              </span>
              <span className="type">
                Price:{" "}
                <span className="tpe__server">
                  {item.price} {item.currency}
                </span>{" "}
              </span>
              <span className="type">
                Menu: <span className="tpe__server">{item.type}</span>{" "}
              </span>
              <span className="type">
                Description:{" "}
                <span className="tpe__server">
                  {item.description.slice(0, 72)}{" "}
                  {item.description.length > 72 ? "..." : null}
                </span>{" "}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanelMenuItems;
