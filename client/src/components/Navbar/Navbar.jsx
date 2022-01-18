import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_CAFFEE } from "../../queries/queries";
import "./Navbar.css";

const NavBar = () => {
  const state = useContext(ThemeContext);
  const { cafeId, cafeName, tableId } = state;
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [style, setStyle] = useState({});
  const [menuTypes, setMenuTypes] = useState([]);
  const { loading, error, data } = useQuery(GET_CAFFEE, {
    variables: {
      _id: Number(cafeId),
    },
  });

  useEffect(() => {
    setStyle({
      ...data?.account?.style,
    });
    data?.account && setMenuTypes(() => [...data?.account?.menuTypes]);
  }, [data]);

  useEffect(() => {
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
                borderBottom: `4px solid ${navbarTitleColor}`,
                borderTop: `4px solid ${navbarTitleColor}`,
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
              className="card__link"
            >
              <i
                className="fas fa-utensils"
                style={{ marginRight: "76px", fontSize: "2rem" }}
              ></i>

              <span className="card__qunatity" style={{ color: navbarBgColor }}>
                1
              </span>
            </NavLink>

            <div className="nav-icon" onClick={handleClick}>
              <i
                className={click ? "fas fa-times" : "fas fa-bars"}
                style={{ color: navbarTitleColor, fontSize: "2rem" }}
              ></i>
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
};

export default NavBar;
