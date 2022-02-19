// import Swiper core and required modules
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,
  Pagination,
  Thumbs,
  Controller,
  EffectCube,
} from "swiper";
import "./styles.css";

import "swiper/swiper-bundle.css";
import ReadMore from "../../components/ReadMore/Readmore";
SwiperCore.use([Navigation, Pagination, Thumbs, Controller, EffectCube]);

export const Swipper = ({
  items,
  addToCard,
  setDetailIsOpen,
  setSelectedItem,
}) => {
  const onDetailOpen = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setDetailIsOpen(true);
    setSelectedItem(() => {
      return {
        ...item,
      };
    });
  };

  const slides2 = [];
  items.map((item, index) => {
    slides2.push(
      <SwiperSlide
        className="slide"
        key={index}
        onClick={(e) => onDetailOpen(e, item)}
      >
        <div className="item__img__container">
          <img src={item.img} alt="img" />
        </div>
        <span className="mainDish__item__name">{item.name}</span>
        <span className="mainDish__item__description">
          <ReadMore>{item.description}</ReadMore>
        </span>
        <span className="mainDish__item__price">
          {item.price} {item.currency}
        </span>

        <button className="order__btn" onClick={(e) => addToCard(e, item._id)}>
          Order
        </button>
      </SwiperSlide>
    );
  });

  return (
    <React.Fragment>
      <Swiper spaceBetween={50} slidesPerView={2}>
        {slides2}
      </Swiper>
    </React.Fragment>
  );
};
