import Modal from "react-modal";
import "./AdminPanelMenuTypesItem.css";

const MoreModel = ({ isOpen, onRequestClose, item }) => {
  console.log("item", item);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "345px",
      height: "419px",
      right: "auto",
      bottom: "auto",
      padding: "30px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "20px",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Add Modal"
    >
      Example
    </Modal>
  );
};

export default MoreModel;
