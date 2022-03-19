import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import { changeFieldHandler } from "../../utils";
import "./EditModal.css";

const EditModal = ({
  isOpen,
  onRequestClose,
  token,
  setNeedRefresh,
  needRefresh,
  name,
  img,
}) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "345px",
      right: "auto",
      bottom: "auto",
      padding: "30px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "20px",
    },
  };

  const [image, setImage] = useState(img);
  const [itemName, setItemName] = useState(name);

  const handleChange = async (e) => {
    const formData = new FormData();
    formData.append("up-img", e.target.files[0], e.target.files[0].name);
    const result = await axios.post(
      "http://localhost:4000/api/account/image-upload",
      formData,
      {
        headers: {
          "x-access-token": token,
        },
      }
    ).then(data=>{
      if (data && data.data && data.data.url) {
        setImage("http://localhost:4000/" + data.data.url);
      }
    });

  
  };

  const isNotUploaded = {
    background: `#bbc2ef url(${img}) no-repeat center center`,
    backgroundSize: "cover",
  };

  const isUploaded = {
    backgroundImage: `url(${image})`,
  };

  console.log("image", image);

  const onAdd = () => {
    changeFieldHandler(
      "http://localhost:4000/api/account/menuType",
      {
        oldName: name,
        newName: itemName,
        img: image,
      },
      token
    ).then(() => setNeedRefresh(!needRefresh));

    onRequestClose();
  };

  console.log("image", image);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Add Modal"
    >
      <div
        className="uploadImage__wrapper"
        style={image ? isUploaded : isNotUploaded}
      >
        <div className="upload__place">
          <button className="chooseImgBtn">Choose photo for</button>
          <input type="file" onChange={handleChange} />
        </div>
      </div>

      <label htmlFor="newValue" className="name__val">
        Name
        <input
          type="text"
          className="adding__name"
          onChange={(e) => setItemName(e.target.value)}
          value={itemName}
          placeholder="Breakfasts"
        />
      </label>

      <div className="addItem__box">
        <button className="addItem__btn" onClick={onAdd}>
          Add
        </button>

        <span className="cancel__name__btn" onClick={onRequestClose}>
          Cancel
        </span>
      </div>
    </Modal>
  );
};

export default EditModal;
