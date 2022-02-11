import React from "react";
import Modal from "react-modal";
import { Accordion } from "./Accordion";

export const ModalWrapper = ({ modalIsOpen, closeModal, tableCart }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      padding: "20px 20px 0px 20px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "20px",
    },
  };

  const { cart, tempCart } = tableCart;
  console.log("cart", cart);
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        {cart && tempCart ? (
          <Accordion cart={cart} tempCart={tempCart} />
        ) : null}
      </Modal>
    </>
  );
};
