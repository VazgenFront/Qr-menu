import { useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import ReadMore from "../../components/ReadMore/Readmore";
import SearchInput from "../../components/SearchInput/SearchInput";
import DetailPage from "../../components/DetailPage/DetailPage";
import Spinner from "../../components/Spinner/Spinner";
import { ThemeContext } from "../../context/ThemeContext";
import { ADD__TEMP__CARD, GET_TABLE_TOKEN } from "../../queries/queries";
import arrowLeft from "./arrowLeft.png";
import "./Cafe.css";
import { Swipper } from "./Swipper";

const Cafe = () => {
  const state = useContext(ThemeContext);
  const { cafeName, cafeId, tableId } = useParams();

  const [getToken, { loading: loadingToken }] = useMutation(GET_TABLE_TOKEN);
  const [addTempOrder, { data: addOrderData }] = useMutation(ADD__TEMP__CARD);

  const [error, setError] = useState({ hasError: false, errorMessage: "" });
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [detilIsOpen, setDetailIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    localStorage.setItem("cafeName", cafeName);
    localStorage.setItem("tableId", tableId);
    localStorage.setItem("cafeId", cafeId);
    state.getCafeName(cafeName);
    state.getCafeId(cafeId);
    state.getTableId(tableId);

    !localStorage.getItem("token") &&
      getToken({
        variables: {
          accountId: cafeId,
          tableId: tableId,
        },
      })
        .then((data) =>
          localStorage.setItem("token", data?.data?.reserveTable?.reserveToken)
        )
        .catch((e) => {
          setError((prevState) => ({
            ...prevState,
            hasError: true,
            errorMessage: e.message,
          }));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const mockedInfo = [];
  mockedInfo.push(state.menuItems);
  const newMockedTypes = mockedInfo.flat();

  const { navbarTitleColor, navbarBgColor } = state.styles;

  const addToCard = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const menuItemId = Number(id);

    addTempOrder({
      variables: {
        accountId: cafeId,
        tableId: tableId,
        reserveToken: localStorage.getItem("token"),
        orderList: [{ menuItemId: menuItemId, itemCount: 1 }],
      },
    })
      .then((data) =>
        state.getTotalItemsCount(data.data.addToTempCart.tempTotalItems)
      )
      .catch((e) => {
        setError((prevState) => ({
          ...prevState,
          hasError: true,
          errorMessage: e.message,
        }));
        localStorage.removeItem("token");
      });
  };

  addOrderData?.addOrder?.cart &&
    localStorage.setItem("items", JSON.stringify(addOrderData?.addOrder?.cart));
  const isEmpty = Object.keys(state.styles).length === 0;

  if (loadingToken) {
    return <Spinner color={navbarTitleColor} />;
  }

  if (error.errorMessage) {
    return (
      <ErrorMessage
        error={error.errorMessage}
        color={navbarTitleColor}
        background={navbarBgColor}
      />
    );
  }

  return (
    <>
      <SearchInput
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        accountId={cafeId}
        setSearchResult={setSearchResult}
      />
      {searchResult.length && searchValue ? (
        <div className="cafeInfo__box">
          <div className="search__result">
            {searchResult?.map((item, index) => {
              return (
                <div className="cafeInfo__menuItem" key={index}>
                  <div
                    className="menuType__item"
                    style={{ marginLeft: index % 2 === 1 ? "20px" : null }}
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
                      onClick={(e) => addToCard(e, item._id)}
                    >
                      Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (isEmpty && !searchValue) || detilIsOpen ? null : (
        <div className="cafeInfo__box">
          <div className="cafeInfo__recommended">
            {newMockedTypes.map((item, index) => {
              return (
                <div
                  className="cafeInfo__menuItem"
                  style={{ padding: detilIsOpen ? null : "0px 30px 0px 30px" }}
                  key={index}
                >
                  <div className="mainDish__info">
                    <div className="mainDish__name">{item.type}</div>

                    <div className="link__to__Type">
                      <NavLink
                        exact
                        to={{
                          pathname: `/${cafeName}/${cafeId}/${tableId}/menuType/${item.type}`,
                        }}
                      >
                        See All {item.menuItemsCount}
                        <img
                          src={arrowLeft}
                          alt="img"
                          style={{ marginLeft: "6px" }}
                        />
                      </NavLink>
                    </div>
                  </div>
                  <Swipper
                    items={item.mainItems}
                    addToCard={addToCard}
                    setDetailIsOpen={setDetailIsOpen}
                    setSelectedItem={setSelectedItem}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
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
    </>
  );
};

export default Cafe;
