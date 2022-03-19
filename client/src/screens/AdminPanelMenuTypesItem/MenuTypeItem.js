import React from "react";
import more from "./more.svg";
import del from "./delete.png";
import edit from "./edit.svg";
import MoreModal from "./MoreModal.js";
import { useToggleModalOpen } from "../../utils";

const MenuTypeItem = ({ idx, item }) => {
  const { openMore, closeMore, moreIsOpen } = useToggleModalOpen();
  const token = localStorage.getItem("adminTkn");

  console.log("moreIsOpen", moreIsOpen);

  return (
    <div className="menuItem_item" key={idx}>
      <div className="menuItm">
        {item.isMainDish ? <div className="mainDish">MAIN DISH</div> : null}
        <div
          className="menuType__img"
          style={{ backgroundImage: `url(${item.img})` }}
        >
          <div className="detailed">
            <div className="circle__btn">
              <img src={more} alt="img" onClick={openMore} />
            </div>
            <div className="circle__btn">
              <img src={edit} alt="img" />
            </div>
            <div className="circle__btn">
              <img src={del} alt="img" />
            </div>
          </div>
        </div>
        <span className="type">
          Name: <span className="tpe__server">{item.name}</span>{" "}
        </span>
        <span className="type">
          Price:{" "}
          <span className="tpe__server">
            {item.price} {item.currency}
          </span>{" "}
        </span>
        <span className="type">
          Menu: <span className="tpe__server">{item.type}</span>{" "}
        </span>
        <span className="type">
          Description:{" "}
          <span className="tpe__server">
            {item.description.slice(0, 72)}{" "}
            {item.description.length > 72 ? "..." : null}
          </span>{" "}
        </span>
      </div>
      {moreIsOpen ? (
        <MoreModal
          onRequestClose={closeMore}
          isOpen={moreIsOpen}
          ariaHideApp={false}
          token={token}
          item={item}
        />
      ) : null}
    </div>
  );
};

export default MenuTypeItem;
