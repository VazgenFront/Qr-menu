import PreOrderItem from "./PreOrderItem.js";
import "./PreOrderWrapper.css";

const PreOrderWrapper = ({ preOrders, setNeedRefresh, needRefresh }) => {
  return (
    <div className="PreOrderWrapper">
      {preOrders.map((item, index) => (
        <PreOrderItem
          key={index}
          item={item}
          setNeedRefresh={setNeedRefresh}
          needRefresh={needRefresh}
        />
      ))}
    </div>
  );
};

export default PreOrderWrapper;
