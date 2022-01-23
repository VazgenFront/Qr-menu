import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_CAFFEE, GET_ORDER } from "../../queries/queries";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../Spinner/Spinner";
import "./Navbar.css";

const NavBar = () => {
  const state = useContext(ThemeContext);
  const { cafeId, cafeName, tableId, totalItemsCount } = state;
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [style, setStyle] = useState({});
  const [menuTypes, setMenuTypes] = useState([]);
  const { loading, error, data } = useQuery(GET_CAFFEE, {
    variables: {
      _id: Number(cafeId),
    },
  });

  const [getOrder, { loading: ld, data: dt, error: err }] =
    useLazyQuery(GET_ORDER);

  useEffect(() => {
    setStyle({
      ...data?.account?.style,
    });
    data?.account && setMenuTypes(() => [...data?.account?.menuTypes]);

    localStorage.getItem("token") &&
      getOrder({
        variables: {
          accountId: Number(cafeId),
          tableId: Number(tableId),
          reserveToken: localStorage.getItem("token"),
        },
      }).then((data) =>
        state.getTotalItemsCount(data?.data?.order?.totalItems)
      );
  }, [data, totalItemsCount, dt]);

  useEffect(() => {
    state.toggleStyle(style);
    state.getMenuItems(data?.account?.menuItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  const { fontFamily, logo, navbarBgColor, navbarTitleColor } = style;

  if (error) {
    return <ErrorMessage error={error?.message} color={navbarTitleColor} />;
  }

  if (loading) {
    return <Spinner color={navbarTitleColor} />;
  }

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
              {cafeId && data && (
                <img src={logo} alt="logo" className="nav-logo" />
              )}
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

              {totalItemsCount ? (
                <span
                  className="card__qunatity"
                  style={{ color: navbarBgColor }}
                >
                  {totalItemsCount}
                </span>
              ) : null}
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
