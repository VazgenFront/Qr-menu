import React from "react";
import "./AdminMenuItemsButtons.css";
const AdminMenuItemsButtons = ({ item, onEdit, onDelete, onDetail }) => {
  return (
    <div
      className="btn__box"
      style={{ justifyContent: onDetail ? "space-between" : "center" }}
    >
      <button className="btn edit" onClick={(e) => onEdit(e, item)}>
        Edit
      </button>

      {onDetail ? (
        <button className="btn detailed" onClick={(e) => onDetail(e, item)}>
          Detailed
        </button>
      ) : null}

      <button
        className="btn delete"
        style={{ marginLeft: onDetail ? "0px" : "20px" }}
        onClick={() => onDelete(item)}
      >
        Delete
      </button>
    </div>
  );
};

export default AdminMenuItemsButtons;
