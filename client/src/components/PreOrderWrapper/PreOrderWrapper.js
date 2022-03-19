import PreOrderItem from "./PreOrderItem.js";
import "./PreOrderWrapper.css";

const PreOrderWrapper = ({
  preOrders,
  setTotalTempCartPrice,
  totalTempCartPrice,
  openModal,
}) => {
  return (
    <div className="PreOrderWrapper">
      {preOrders.map((item, index) => (
        <PreOrderItem
          key={index}
          item={item}
          setTotalTempCartPrice={setTotalTempCartPrice}
          totalTempCartPrice={totalTempCartPrice}
        />
      ))}

      <div className="order__wrapper">
        <div className="temp__total__price">
          Total: {totalTempCartPrice} AMD
        </div>
        <button className="temp__order__cart" onClick={openModal}>
          Order
        </button>
      </div>
    </div>
  );
};

export default PreOrderWrapper;
