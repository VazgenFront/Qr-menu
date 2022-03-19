import { useState } from "react";
import { useMutation } from "@apollo/client";
import Modal from "react-modal";
import { ADD_ORDER } from "../../queries/queries";
import "./Card.css";
import success from "./success.png";

const OrderModal = ({
  accountId,
  tableId,
  reserveToken,
  modalIsOpen,
  closeModal,
  setModalIsOpen,
  setAllOrders,
  setOrderOpen,
  setPreOrderOpen,
}) => {
  const [addOrderToCart, { loading: addOrderLoading }] = useMutation(ADD_ORDER);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const orderTempCart = () => {
    setIsConfirmed(true);
  };

  const onSuccess = async () => {
    await addOrderToCart({
      variables: {
        accountId,
        tableId,
        reserveToken,
      },
    });
    setModalIsOpen(false);
    setOrderOpen(true);
    setPreOrderOpen(false);
  };

  const denyOrder = async () => {
    setModalIsOpen(false);
  };

  const customStyles = {
    content: {
      width: "350px",
      height: !isConfirmed ? "222px" : "auto",
      background: "#FFFFFF",
      top: "50%",
      left: "50%",
      right: "auto",
      overflow: "hidden",
      bottom: "auto",
      padding: "30px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
    },
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      {!isConfirmed ? (
        <div className="unconfirm">
          <span className="modal__title">
            Are you sure you want to confirm the order?
          </span>
          <span className="modal__text">
            In case you changed your mind it will not be possible to cancel the
            order.
          </span>
          <div className="modal__btn__box">
            <button className="confirm__btn" onClick={orderTempCart}>
              Yes
            </button>
            <button
              className="cancel__btn"
              onClick={denyOrder}
              style={{ marginLeft: "64px" }}
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="confirm">
          <p className="confirm__title">Your order was confirmed!</p>
          <img src={success} alt="img" className="confirm__img" />
          <p onClick={onSuccess} className="view__order">
            View order
          </p>
        </div>
      )}
    </Modal>
  );
};

export default OrderModal;
