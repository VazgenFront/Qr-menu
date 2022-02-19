import { useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPage from "../../components/DetailPage/DetailPage";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import ReadMore from "../../components/ReadMore/Readmore";
import Spinner from "../../components/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { ADD__TEMP__CARD, GET_MENUTYPE_INFO } from "../../queries/queries";
import "./menuTypes.css";

const MenuType = () => {
  const { cafeId, menuType, tableId } = useParams();
  const state = useContext(ThemeContext);

  const [menuTypes, setMenuTypes] = useState([]);
  const [detilIsOpen, setDetailIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const { data, error, loading } = useQuery(GET_MENUTYPE_INFO, {
    variables: {
      accountId: cafeId,
      type: menuType,
    },
  });
  const [addOrder, { loading: loadingAddOrder, error: addOrderDataError }] =
    useMutation(ADD__TEMP__CARD);

  useEffect(() => {
    data?.menuItemsOfType && setMenuTypes(() => [...data?.menuItemsOfType]);
    menuType && state.getMenuTypeName(menuType);
  }, [data]);

  const { navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = async (id) => {
    const menuItemId = Number(id);

    const totalItemsCount = await addOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    }).then((data) => data.data?.addOrder?.totalItems);

    state.getTotalItemsCount(totalItemsCount);
  };

  const onDetailOpen = (item) => {
    setDetailIsOpen(true);
    setSelectedItem(() => {
      return {
        ...item,
      };
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
    <div className="menuTypes__box">
      <div className="menuType__box">
        {menuTypes && !detilIsOpen
          ? menuTypes.map((item, index) => (
              <div
                className="menuType__item"
                style={{ marginLeft: index % 2 === 1 ? "20px" : null }}
                onClick={() => onDetailOpen(item)}
              >
                <div className="item__img__container">
                  <img src={item.img} alt="" />
                </div>
                <span className="mainDish__item__name">{item.name}</span>
                <span className="mainDish__item__price">
                  {item.price} {item.currency}
                </span>
                <span className="mainDish__item__description">
                  <ReadMore>{item.description}</ReadMore>
                </span>
                <button
                  className="order__btn"
                  onClick={() => addToCard(item._id)}
                >
                  Order
                </button>
              </div>
            ))
          : null}
      </div>

      {detilIsOpen ? (
        <DetailPage
          cafeId={cafeId}
          tableId={tableId}
          selectedItem={selectedItem}
          setDetailIsOpen={setDetailIsOpen}
          detilIsOpen={detilIsOpen}
          className="detail_page"
        />
      ) : null}
    </div>
  );
};

export default MenuType;
