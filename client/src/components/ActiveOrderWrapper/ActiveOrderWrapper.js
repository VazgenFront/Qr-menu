import { useEffect } from "react";
import './ActiveOrderWrapper.css'
const ActiveOrderWrapper = ({ activeOrders }) => {
  console.log("activeOrders", activeOrders);
  return (
    <div className="ActiveOrderWrapper">
      {activeOrders.map((item, index) => (
        <p key={index}>{item.itemName}</p>
      ))}
    </div>
  );
};

export default ActiveOrderWrapper;
