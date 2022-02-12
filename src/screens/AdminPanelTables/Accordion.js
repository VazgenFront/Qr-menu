import React, { useState } from "react";

export const Accordion = ({ cart, tempCart }) => {
  const [isOpen, setOpen] = useState(true);

  const finalTempCart = tempCart.filter((item) => item.itemCount > 0);
  const finalCart = cart.filter((item) => item.itemCount > 0);

  return (
    <div className="accordion-wrapper-order">
      <div
        className={`accordion-item-cart ${!isOpen ? "collapsed" : ""}`}
        onClick={() => setOpen(!isOpen)}
      >
        <>
          {finalCart?.length ? (
            <>
              {isOpen ? <span>Ordered</span> : null}
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>name</th>
                    <th>quantity</th>
                    <th>price per one</th>
                    <th>total Count</th>
                  </tr>
                </thead>
                <tbody>
                  {finalCart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{item.itemCount}</td>
                      <td>{item.itemPrice}</td>
                      <td>{item.itemTotalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </>
        <>
          {finalTempCart?.length ? (
            <>
              {isOpen ? <span>Want to order</span> : null}
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>name</th>
                    <th>quantity</th>
                    <th>price per one</th>
                    <th>total Count</th>
                  </tr>
                </thead>
                <tbody>
                  {finalTempCart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{item.itemCount}</td>
                      <td>{item.itemPrice}</td>
                      <td>{item.itemTotalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </>
      </div>
    </div>
  );
};
