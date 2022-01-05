import React, { Component, createContext } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    cafeName: "",
    styles: {},
    menuItems: [],
  };

  toggleStyle = (styles) => {
    this.setState({ styles: styles });
  };

  getCafeName = (cafeNameFromParam) =>
    this.setState({ cafeName: cafeNameFromParam });

  getMenuItems = (menuItemsFromServer) => {
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
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
