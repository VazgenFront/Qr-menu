import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import ActiveOrderWrapper from "../../components/ActiveOrderWrapper/ActiveOrderWrapper.js";
import PreOrderWrapper from "../../components/PreOrderWrapper/PreOrderWrapper.js";
import { ADD_ORDER, GET_ORDER } from "../../queries/queries";
import "./Card.css";

const Card = () => {
  const [preOrderOpen, setPreOrderOpen] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);
  const [allOrders, setAllOrders] = useState({
    preOrders: [],
    activeOrders: [],
  });
  const [totalTempCartPrice, setTotalTempCartPrice] = useState(0);
  const [needRefresh, setNeedRefresh] = useState(false);

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

  const [getOrder, { loading }] = useLazyQuery(GET_ORDER);
  const [addOrderToCart] = useMutation(ADD_ORDER);

  useEffect(() => {
    getOrder({
      variables: {
        accountId: cafeId,
        tableId,
        reserveToken,
      },
    }).then((data) => {
      const { tempCart, cart } = data?.data?.order;
      setTotalTempCartPrice(data?.data?.order?.tempTotalPrice);
      setPreOrderOpen(preOrderOpen);
      setOrderOpen(orderOpen);
      setAllOrders((prevState) => {
        return {
          ...prevState,
          preOrders: tempCart,
          activeOrders: cart,
        };
      });
    });
  }, [needRefresh]);

  const { preOrders, activeOrders } = allOrders;

  const orderTempCart = async () => {
    addOrderToCart({
      variables: {
        accountId: cafeId,
        tableId,
        reserveToken,
      },
    });
  };

  return (
    <div className="Card">
      <div className="card_box">
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
        {preOrderOpen && !orderOpen && (
          <PreOrderWrapper
            preOrders={preOrders}
            needRefresh={needRefresh}
            setNeedRefresh={setNeedRefresh}
          />
        )}
        {orderOpen && !preOrderOpen && (
          <ActiveOrderWrapper activeOrders={activeOrders} />
        )}
      </div>
      <div className="order__wrapper">
        <div className="temp__total__price">
          Total: {totalTempCartPrice} AMD
        </div>
        <button className="temp__order__cart" onClick={orderTempCart}>
          Order
        </button>
      </div>
    </div>
  );
};

export default Card;
