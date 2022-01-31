import { useRef } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const cafeName = localStorage.getItem("cafeName");
  const cafeId = localStorage.getItem("cafeId");

  const sidebarNavItems = [
    {
      display: "Home",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/home`,
    },

    {
      display: "MenuTypes",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/menuTypes`,
    },
    {
      display: "MenuItems",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/menuItem`,
    },
    {
      display: "MainDishes",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/mainDishes`,
    },

    {
      display: "Tables",
      to: "/order",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__logo">{cafeName}</div>
      <div className="sidebar__menu">
        <div className="sidebar__menu__indicator"></div>
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div className="sidebar__menu__item">
              <div className="sidebar__menu__item__text">{item.display}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
