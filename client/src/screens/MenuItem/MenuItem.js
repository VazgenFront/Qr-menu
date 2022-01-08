import { useQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import BuyingInfo from "../../components/Navbar/BuyingInfo/BuyingInfo";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_MENU_ITEM, MAKE_ORDER } from "../../queries/queries";
import "./MenuItem.css";

const MenuItem = () => {
  const [item, setItem] = useState({});
  const history = useHistory();
  const { itemId, cafeName, cafeId, tableId } = useParams();
  const state = useContext(ThemeContext);
  const { navbarBgColor, navbarTitleColor } = state.styles;

  const [
    addOrder,
    { loading: loadingAddOrder, data: addOrderData, error: addOrderDataError },
  ] = useMutation(MAKE_ORDER);

  const { data, loading, error } = useQuery(GET_MENU_ITEM, {
    variables: {
      _id: itemId,
    },
  });

  useEffect(() => {
    setItem((prevItem) => ({
      ...prevItem,
      ...data?.menuItem,
    }));
  }, [data]);

  console.log("state.styles", state.styles);

  const addToCard = (id) => {
    addOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: 16, itemCount: 1 }],
      },
    });
    history.push(`/${cafeName}/${cafeId}/${tableId}/card`);
  };

  return (
    <div className="menuItem__box" style={{ background: navbarBgColor }}>
      <span className="menuItem__title" style={{ color: navbarTitleColor }}>
        {item?.name}
      </span>
      <img src={item?.img} alt="img" className="menuItem__img" />
      <span
        className="menuItem__description"
        style={{ color: navbarTitleColor }}
      >
        {item?.description}
      </span>
      <BuyingInfo
        navbarTitleColor={navbarTitleColor}
        item={item}
        addToCard={addToCard}
      />
    </div>
  );
};

export default MenuItem;
