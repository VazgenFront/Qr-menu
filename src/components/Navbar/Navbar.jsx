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
      _id: cafeId,
    },
  });

  const [getOrder, { data: dt }] = useLazyQuery(GET_ORDER);

  const getTotalItemsCountFnc = async () => {
    await getOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
      },
    }).then((data) =>
      state.getTotalItemsCount(data?.data?.order?.tempTotalItems)
    );
  };

  useEffect(async () => {
    setStyle({
      ...data?.account?.style,
    });
    data?.account && setMenuTypes(() => [...data?.account?.menuTypes]);

    localStorage.getItem("token") && (await getTotalItemsCountFnc());
  }, [data, totalItemsCount, dt, state.totalItemsCount]);

  useEffect(() => {
    state.toggleStyle(style);
    state.getMenuItems(data?.account?.mainDishes);
  }, [style]);

  const { fontFamily, logo, navbarBgColor, navbarTitleColor } = style;

  if (error) {
    return (
      <ErrorMessage
        error={"Something gone wrong, please reload the page"}
        color={navbarTitleColor}
        background={navbarBgColor}
      />
    );
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
                  style={{
                    color: navbarBgColor,
                    backgroundColor: navbarTitleColor,
                  }}
                >
                  {state.totalItemsCount}
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
