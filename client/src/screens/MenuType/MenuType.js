import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BuyingInfo from "../../components/BuyingInfo/BuyingInfo";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import ReadMore from "../../components/ReadMore/Readmore";
import Spinner from "../../components/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { GET_MENUTYPE_INFO, MAKE_ORDER } from "../../queries/queries";
import "./menuTypes.css";

const MenuType = () => {
  const { cafeId, menuType, tableId } = useParams();

  const [menuTypes, setMenuTypes] = useState([]);

  const state = useContext(ThemeContext);

  const { data, error, loading } = useQuery(GET_MENUTYPE_INFO, {
    variables: {
      accountId: Number(cafeId),
      type: menuType,
    },
  });

  const [addOrder, { loading: loadingAddOrder, error: addOrderDataError }] =
    useMutation(MAKE_ORDER);

  useEffect(() => {
    data?.menuItemsOfType && setMenuTypes(() => [...data?.menuItemsOfType]);
  }, [data]);

  const { navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = (id) => {
    const menuItemId = Number(id);
    const serverCafeId = Number(cafeId);
    const serverTableId = Number(tableId);

    addOrder({
      variables: {
        accountId: serverCafeId,
        tableId: serverTableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    });
  };

  if (loading) {
    return <Spinner color={navbarTitleColor} />;
  }

  if (error || addOrderDataError) {
    return (
      <ErrorMessage
        error={error || addOrderDataError}
        color={navbarTitleColor}
      />
    );
  }

  return (
    <div className="menuTypes__box" style={{ background: navbarBgColor }}>
      <div className="cafeInfo__recommended">
        {menuTypes.map((item, index) => (
          <div
            className="menuType__menuItem"
            key={index}
            style={{
              background: navbarBgColor,
              border: `4px solid ${navbarTitleColor}`,
            }}
          >
            <img
              src={item?.img}
              alt="img"
              className="menuType__menuItem__img"
            />
            <span
              className="menuType__menuItems__name"
              style={{ color: navbarTitleColor }}
            >
              {item?.name}
            </span>
            <span
              className="menuType__menuItem__description"
              style={{ color: navbarTitleColor }}
            >
              <ReadMore>{item?.description}</ReadMore>
            </span>
            <BuyingInfo
              navbarTitleColor={navbarTitleColor}
              item={item}
              addToCard={addToCard}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuType;
