import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ActiveOrderWrapper from "../../components/ActiveOrderWrapper/ActiveOrderWrapper.js";
import PreOrderWrapper from "../../components/PreOrderWrapper/PreOrderWrapper.js";
import Spinner from "../../components/Spinner/Spinner.js";
import { GET_ORDER } from "../../queries/queries";
import "./Card.css";
import OrderMOdal from "./OrderModal";
import empty from "./empty.png";

const Card = () => {
  const [preOrderOpen, setPreOrderOpen] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);
  const [allOrders, setAllOrders] = useState({
    preOrders: [],
    activeOrders: [],
  });
  const [totalTempCartPrice, setTotalTempCartPrice] = useState("0");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const reserveToken = localStorage.getItem("token");
  const cafeId = localStorage.getItem("cafeId");
  const tableId = localStorage.getItem("tableId");

  const preOpenOrder = () => {
    setPreOrderOpen(true);
    setOrderOpen(false);
  };

  const openOrder = () => {
    setOrderOpen(true);
    setPreOrderOpen(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const [getOrder, { loading, data }] = useLazyQuery(GET_ORDER);

  useEffect(async () => {
    await getOrder({
      variables: {
        accountId: cafeId,
        tableId,
        reserveToken,
      },
    }).then((data) => {
      const { tempCart, cart } = data?.data?.order;
      setTotalTempCartPrice(data?.data?.order?.tempTotalPrice + "");
      setPreOrderOpen(preOrderOpen);
      setOrderOpen(orderOpen);
      setAllOrders(() => {
        return {
          preOrders: tempCart,
          activeOrders: cart,
        };
      });
    });
  }, [preOrderOpen]);

  const { preOrders, activeOrders } = allOrders;

  if (loading) {
    return <Spinner color={"#784f2d"} />;
  }

  return (
    <div className="Card">
      <div className="order__box">
        <span
          className={`order_item ${preOrderOpen && "active"}`}
          onClick={preOpenOrder}
        >
          Pre-ordered
        </span>
        <span
          className={`order_item ${orderOpen && "active"}`}
          style={{ marginLeft: "30px" }}
          onClick={openOrder}
        >
          Ordered
        </span>
      </div>
      {preOrderOpen && !orderOpen ? (
        <div className="card_box">
          {preOrders?.length ? (
            <PreOrderWrapper
              preOrders={preOrders}
              setTotalTempCartPrice={setTotalTempCartPrice}
              totalTempCartPrice={totalTempCartPrice}
              openModal={openModal}
            />
          ) : (
            <div className="empty_cart">
              <img src={empty} alt="img" className="empty__img" />
              <span className="empty__cart_title">Your cart is empty</span>
              <span className="empty__cart_text">
                You haven’t added anything yet. Start by selecting an item that
                will surely make your tummy happy!
              </span>
            </div>
          )}
        </div>
      ) : null}

      {orderOpen && !preOrderOpen && (
        <ActiveOrderWrapper activeOrders={activeOrders} />
      )}
      {modalIsOpen && (
        <OrderMOdal
          accountId={cafeId}
          setModalIsOpen={setModalIsOpen}
          tableId={tableId}
          reserveToken={reserveToken}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          setAllOrders={setAllOrders}
          setOrderOpen={setOrderOpen}
          setPreOrderOpen={setPreOrderOpen}
        />
      )}
    </div>
  );
};

export default Card;
