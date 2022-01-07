import React, { useContext, useLayoutEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_CAFFEE } from "../../queries/queries";
import "./Navbar.css";
import logos from "./logo.png";

const NavBar = () => {
  const state = useContext(ThemeContext);
  const { cafeId, cafeName, tableId } = state;
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [style, setStyle] = useState({});
  const [menuTypes, setMenuTypes] = useState([]);
  const [getCafe, { loading, error, data }] = useLazyQuery(GET_CAFFEE);

  useLayoutEffect(() => {
    setStyle({
      ...data?.account?.style,
    });
    data?.account && setMenuTypes(() => [...data?.account?.menuTypes]);
  }, [data]);

  useLayoutEffect(() => {
    getCafe({ variables: { _id: cafeId } });
    state.toggleStyle(style);
    state.getMenuItems(data?.account?.menuItems);
  }, [style]);

  const {
    fontFamily,
    logo,
    mostBookedBorder,
    navbarBgColor,
    navbarTitleColor,
  } = style;

  return (
    <>
      {data?.account ? (
        <nav
          className="navbar"
          style={{
            backgroundColor: navbarBgColor,
            color: navbarTitleColor,
            fontFamily: fontFamily,
          }}
        >
          <div className="nav-container">
            <NavLink exact to={`/${cafeName}/${cafeId}/${tableId}`}>
              {cafeId && data && <img src={logo} className="nav-logo" />}
            </NavLink>

            <ul
              className={click ? "nav-menu active" : "nav-menu"}
              style={{
                backgroundColor: click ? navbarBgColor : null,
                border: mostBookedBorder,
              }}
            >
              {menuTypes.map((menuItem, index) => (
                <li className="nav-item" key={`nav-${index}`}>
                  <NavLink
                    exact
                    to={`/${cafeName}/${cafeId}/${tableId}/menuType/${menuItem?.name}`}
                    activeClassName="active"
                    className="nav-links"
                    style={{ color: navbarTitleColor }}
                    onClick={handleClick}
                  >
                    {menuItem?.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <NavLink
              exact
              to={`/${cafeName}/${cafeId}/${tableId}/card`}
              style={{ color: navbarTitleColor }}
            >
              <i
                className="fas fa-utensils"
                style={{ marginRight: "70px", fontSize: "1.8rem" }}
              ></i>
            </NavLink>

            <div className="nav-icon" onClick={handleClick}>
              <i
                className={click ? "fas fa-times" : "fas fa-bars"}
                style={{ color: navbarTitleColor }}
              ></i>
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
};

export default NavBar;
