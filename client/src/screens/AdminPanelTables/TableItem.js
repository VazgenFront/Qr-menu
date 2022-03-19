import React, { useState } from "react";
import table from "./table.svg";
import { Toggle } from "./Toggle";

const TableItem = ({ index, item }) => {
  const [checked, setChecked] = useState(false);
  console.log("checked", checked);
  return (
    <div className="tables__item" key={index}>
      <div className="table">
        <img src={table} alt="img" className="table__img" />
        <span className="table__num">{item.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="example">
          <span
            style={{ left: "-102px" }}
            className={
              !checked ? "circle__table__ok reserve" : "circle__table__disable"
            }
          >
            Reserved
          </span>
          <Toggle setChecked={setChecked} checked={checked} />
          <span
            style={{ left: "102px" }}
            className={
              checked ? "circle__table__ok free" : "circle__table__disable"
            }
          >
            Free
          </span>
        </div>
      </div>
    </div>
  );
};

export default TableItem;
