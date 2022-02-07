import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { addFieldHandler, changeFieldHandler } from "../../utils";
import UploadImage from "../UploadImage/UploadImage";
import "./Modal.css";
import axios from "axios";

const renderMenuTypes = ({
  closeModal,
  destiny,
  selectedType,
  token,
  needRefresh,
  setNeedRefresh,
  menuType,
}) => {
  const url = "http://localhost:4000/api/account/menuType";
  return (
    <>
      {destiny === "edit" ? (
        <EditModal
          selectedType={selectedType}
          closeModal={closeModal}
          token={token}
          from={"menuType"}
          url={url}
          needRefresh={needRefresh}
          setNeedRefresh={setNeedRefresh}
          menuType={menuType}
        />
      ) : (
        <AddModal
          closeModal={closeModal}
          token={token}
          from={"menuType"}
          url={url}
          needRefresh={needRefresh}
          setNeedRefresh={setNeedRefresh}
          menuType={menuType}
        />
      )}
    </>
  );
};

const renderMenuItems = ({
  closeModal,
  destiny,
  selectedType,
  token,
  needRefresh,
  setNeedRefresh,
  menuType,
}) => {
  const url = "http://localhost:4000/api/account/menuItem";

  return (
    <>
      {destiny === "edit" ? (
        <EditModal
          selectedType={selectedType}
          closeModal={closeModal}
          token={token}
          from={"item"}
          url={url}
          needRefresh={needRefresh}
          setNeedRefresh={setNeedRefresh}
        />
      ) : (
        <AddModal
          closeModal={closeModal}
          token={token}
          from={"item"}
          url={url}
          needRefresh={needRefresh}
          setNeedRefresh={setNeedRefresh}
          menuType={menuType}
        />
      )}
    </>
  );
};

const ModalWrapper = ({
  modalIsOpen,
  closeModal,
  destiny,
  selectedType,
  token,
  from,
  needRefresh,
  setNeedRefresh,
  menuType,
}) => {
  const customStyles = {
    content: {
      width: "320px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      padding: "0px 0px 20px 0px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "20px",
    },
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        {from === "menuTypes"
          ? renderMenuTypes({
              closeModal,
              destiny,
              selectedType,
              token,
              needRefresh,
              setNeedRefresh,
              menuType,
            })
          : renderMenuItems({
              closeModal,
              destiny,
              selectedType,
              token,
              needRefresh,
              setNeedRefresh,
              menuType,
            })}
      </Modal>
    </div>
  );
};

const EditModal = ({
  selectedType,
  closeModal,
  token,
  url,
  from,
  needRefresh,
  setNeedRefresh,
  menuType,
}) => {
  const [itemName, setItemName] = useState(selectedType.name);
  const [image, setImage] = useState("");
  const [itemPrice, setItemPrice] = useState(selectedType.price);
  const [isMainDIsh, setIsMainDish] = useState(selectedType.isMainDish);
  const [itemDescription, setItemDescription] = useState(
    selectedType.description
  );
  const [itemType, setItemType] = useState("" || selectedType.type);

  const prevName = useRef("");

  useEffect(() => {
    prevName.current = itemName;
  }, [image]);

  const onChange = (e, type) => {
    if (type === "name") {
      setItemName(e.target.value);
    }
    if (type === "desc") {
      setItemDescription(e.target.value);
    }
    if (type === "price") {
      setItemPrice(e.target.value);
    }

    if (type === "type") {
      setItemType(e.target.value);
    }

    if (type === "mainDish") {
      setIsMainDish(!isMainDIsh);
    }
  };

  const isItemRequest = from === "item";
  const body = isItemRequest
    ? {
        id: selectedType._id,
        type: itemType,
        name: itemName,
        description: itemDescription,
        isMainDish: isMainDIsh,
        img: image || selectedType.img,
        price: itemPrice,
        currency: "AMD",
      }
    : {
        oldName: prevName.current,
        newName: itemName,
        img: image || selectedType.img,
      };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      // let reader = new FileReader();
      //
      // reader.onload = function (e) {
      //   setImage(e.target.result);
      // };
      // reader.readAsDataURL(e.target.files[0]);
      const formData = new FormData();
      formData.append('up-img', e.target.files[0], e.target.files[0].name);
      const result = await axios.post('http://localhost:4000/api/account/image-upload', formData, {
        headers: {
          "x-access-token": token,
        },
      });
      if (result && result.data && result.data.url) {
        console.log(result.data.url);
        setImage(result.data.url);
      }
    }
  };

  const onSave = async () => {
    console.log("body", body);
    await changeFieldHandler(url, body, token);
    closeModal();
    setNeedRefresh(!needRefresh);
  };

  return (
    <div className="EditModal">
      <div className="EditModal__img">
        <img src={image || selectedType.img} alt="img" className="item__img" />
      </div>

      {itemName ? (
        <input
          type="text"
          className="editModal__input"
          placeholder="Fill item name"
          value={itemName}
          onChange={(e) => onChange(e, "name")}
        />
      ) : null}
      {selectedType.description || selectedType.description === "" ? (
        <textarea
          type="text"
          className="editModal__input"
          placeholder="Fill item description"
          style={{ minHeight: "300px" }}
          value={itemDescription}
          onChange={(e) => onChange(e, "desc")}
        />
      ) : null}

      {isItemRequest ? (
        <label className="isMainDish">
          Is main dish
          <input
            type="checkbox"
            style={{ width: "30px", height: "30px" }}
            onChange={(e) => onChange(e, "mainDish")}
            checked={isMainDIsh}
          />
        </label>
      ) : null}

      {isItemRequest ? (
        <input
          type="text"
          className="editModal__input"
          placeholder="Fill item type"
          value={menuType || itemType}
          onChange={(e) => onChange(e, "type")}
        />
      ) : null}

      {selectedType.price ? (
        <input
          type="text"
          placeholder="Fill item price"
          className="editModal__input"
          value={itemPrice}
          onChange={(e) => onChange(e, "price")}
        />
      ) : null}

      <div className="edit__btn__box">
        <input
          type="file"
          name="up-img"
          style={{ width: "100%", height: "100%", marginTop: "10px" }}
          accept=".jpg,.jpeg,.gif,.png"
          onChange={handleImageChange}
        />

        <button className="btn edit" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

const AddModal = ({
  token,
  closeModal,
  url,
  needRefresh,
  setNeedRefresh,
  from,
  menuType,
}) => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [image, setImage] = useState("");
  const [itemType, setItemType] = useState(menuType || "");

  const onChange = (e, type) => {
    if (type === "name") {
      setItemName(e.target.value);
    }
    if (type === "desc") {
      setItemDescription(e.target.value);
    }

    if (type === "price") {
      setItemPrice(e.target.value);
    }

    if (type === "type") {
      setItemType(e.target.value);
    }
  };

  const isItemRequest = from === "item";

  const body = isItemRequest
    ? {
        type: itemType,
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        img: image,
        currency: "AMD",
      }
    : { typeName: itemName, img: "" };
  const onSave = async () => {
    await addFieldHandler(url, body, token);
    closeModal();
    setNeedRefresh(!needRefresh);
  };

  return (
    <div className="AddModal">
      <div className="EditModal__img">
        <UploadImage image={image} setImage={setImage} />
      </div>
      <input
        type="text"
        className="editModal__input"
        placeholder={isItemRequest ? "Fill item name" : "fillMenuType"}
        value={itemName}
        onChange={(e) => onChange(e, "name")}
      />

      {isItemRequest ? (
        <textarea
          type="text"
          className="editModal__input"
          style={{ minHeight: "300px" }}
          placeholder="Fill item description"
          value={itemDescription}
          onChange={(e) => onChange(e, "desc")}
        />
      ) : null}

      {isItemRequest ? (
        <input
          type="text"
          className="editModal__input"
          placeholder="Fill item type"
          value={menuType || itemType}
          onChange={(e) => onChange(e, "type")}
        />
      ) : null}

      {isItemRequest ? (
        <input
          type="text"
          className="editModal__input"
          placeholder="Fill item price"
          value={itemPrice}
          onChange={(e) => onChange(e, "price")}
        />
      ) : null}

      <div className="edit__btn__box">
        <button className="btn edit" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ModalWrapper;
