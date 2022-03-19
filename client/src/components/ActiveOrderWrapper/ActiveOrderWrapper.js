import ReadMore from "../ReadMore/Readmore";
import "./ActiveOrderWrapper.css";
const ActiveOrderWrapper = ({ activeOrders }) => {
  console.log("activeOrders", activeOrders);

  const totalPrice = activeOrders?.reduce((acc, curr) => {
    return (acc += curr.itemTotalPrice);
  }, 0);

  return (
    <div className="ActiveOrderWrapper">
      {activeOrders?.map((item, index) => (
        <div className="activeorder__item" key={index}>
          <img src={item?.img} alt="img" className="activeorder__item__img" />
          <div className="activeorder__item__info__box">
            <div className="name__cancel">
              <span className="activeorder__item__info__name">
                {item?.itemName.slice(0, 8)}...
              </span>

              <span className="activeorder__item__count">
                x {item.itemCount}
              </span>
            </div>
            <span className="activeorder__item__info__description">
              <ReadMore>
                {"Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam repudiandae repellat perspiciatis sit, beatae eaque nihil".slice(
                  0,
                  72
                )}
              </ReadMore>
            </span>
            <span className="activeorder__item__info__price">
              {item.itemPrice} {item.currency}
            </span>
          </div>
        </div>
      ))}
      <div className="price_wrapper">
        <div className="active__price">Total: </div>
        <div className="acitve__amount">{totalPrice} AMD</div>
      </div>
    </div>
  );
};

export default ActiveOrderWrapper;
