import { useLazyQuery } from "@apollo/client";
import React, { useContext, useLayoutEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_CAFFEE } from "../../queries/queries";
import "./Navbar.css";

const NavBar = () => {
  const state = useContext(ThemeContext);

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [style, setStyle] = useState({});
  const [menuTypes, setMenuTypes] = useState([]);
  const cafeName = state.cafeName;
  const [getCafe, { loading, error, data }] = useLazyQuery(GET_CAFFEE);

  useLayoutEffect(() => {
    setStyle({
      ...data?.account?.style,
    });

    data && !loading && setMenuTypes(() => [...data?.account?.menuTypes]);
  }, [data]);

  useLayoutEffect(() => {
    cafeName && getCafe({ variables: { username: cafeName } });
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

  error && console.log("erorr");

  return (
    <>
      {cafeName ? (
        <nav
          className="navbar"
          style={{
            backgroundColor: navbarBgColor,
            color: navbarTitleColor,
            fontFamily: fontFamily,
          }}
        >
          <div className="nav-container">
            <NavLink exact to={`/${cafeName}`}>
              <img src={logo} alt="logo" className="nav-logo" />
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
                    to={menuItem?.url}
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
