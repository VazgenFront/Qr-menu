import { NavLink, Link } from "react-router-dom";
import dash from "./dashboard.svg";
import menu from "./menuItems.svg";
import allItems from "./allItems.svg";
import tables from "./tables.svg";
import "./Dashboard.css";

const Dashboard = () => {
  const cafeName = localStorage.getItem("cafeName");
  const cafeId = localStorage.getItem("cafeId");

  const sidebarNavItems = [
    {
      name: "DashBoard",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/home`,
      img: dash,
    },

    {
      name: "Menu Types",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/menuTypes`,
      img: menu,
    },

    {
      name: "All Items",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/menuItems`,
      img: allItems,
    },

    {
      name: "Tables",
      to: `/admin-panel/${cafeId}/${cafeName}/dashboard/tables`,
      img: tables,
    },
  ];

  return (
    <div className="DashBoard">
      <div className="cafeName">
        <Link
          to={`/admin-panel/1/${cafeName}/dashboard/home`}
          className="cafeNameLink"
        >
          {cafeName}
        </Link>
      </div>
      <ul className="menus">
        {sidebarNavItems.map(({ name, to, img }, index) => {
          return (
            <NavLink
              className="menuItem"
              to={to}
              key={index}
              activeClassName="activee"
            >
              <img src={img} alt={img} className="dash__img" />
              <span className='dash__name' >{name}</span>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};

export default Dashboard;
