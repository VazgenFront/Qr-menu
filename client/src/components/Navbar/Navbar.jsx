import { useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_CAFFEE, GET_ORDER } from "../../queries/queries";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Spinner from "../Spinner/Spinner";
import cart from "./cart.png";
import "./Navbar.css";

const NavBar = () => {
  const state = useContext(ThemeContext);
  const { cafeId, cafeName, tableId, totalItemsCount, menuType } = state;
  const [style, setStyle] = useState({});
  const [title, setTitle] = useState("");

  const { loading, error, data } = useQuery(GET_CAFFEE, {
    variables: {
      _id: cafeId,
    },
  });

  const isInMenuType = window.location.pathname.includes("menuType");
  const isInCart = window.location.pathname.includes("card");

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

    localStorage.getItem("token") && (await getTotalItemsCountFnc());
  }, [data, totalItemsCount, dt, state.totalItemsCount]);

  useEffect(() => {
    if (isInMenuType) {
      setTitle(menuType);
    } else if (isInCart) {
      setTitle("My List");
    } else {
      setTitle(cafeName);
    }

    state.toggleStyle(style);
    state.getMenuItems(data?.account?.mainDishes);
  }, [style, window.location.pathname]);

  const { logo, navbarBgColor, navbarTitleColor } = style;

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
    <div className="NavBar">
      <div className="navbar__wrapper">
        <NavLink
          exact
          to={{
            pathname: `/${cafeName}/${cafeId}/${tableId}`,
          }}
        >
          <img src={logo} alt="img" className="navbar__logo" />
        </NavLink>
        <div className="navbar__cafe__title">{title}</div>
        <NavLink
          exact
          to={{
            pathname: `/${cafeName}/${cafeId}/${tableId}/card`,
          }}
        >
          <div className="cart__box">
            <img src={cart} alt="img" className="cart__circle__img" />
            {totalItemsCount ? (
              <div className="cart__count__circle">{totalItemsCount}</div>
            ) : null}
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
