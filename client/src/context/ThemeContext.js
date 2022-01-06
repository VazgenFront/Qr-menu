import React, { Component, createContext } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    cafeName: localStorage.getItem("cafeName") || "",
    styles: {},
    cafeId: localStorage.getItem("cafeId") || "0",
    menuItems: [],
    card: localStorage.getItem("card") || [],
  };

  getCafeId = (IdFromParams) => {
    this.setState({ cafeId: IdFromParams });
  };

  toggleStyle = (styles) => {
    localStorage.setItem("styles", styles);
    this.setState({ styles: styles });
  };

  getCafeName = (cafeNameFromParams) => {
    this.setState({ cafeName: cafeNameFromParams });
  };

  getMenuItems = (menuItemsFromServer) => {
    localStorage.setItem("menuItems", menuItemsFromServer);
    this.setState({ menuItems: menuItemsFromServer });
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          toggleStyle: this.toggleStyle,
          getCafeName: this.getCafeName,
          getMenuItems: this.getMenuItems,
          getCafeId: this.getCafeId,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
