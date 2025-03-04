import React, { Component, createContext } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cafeName: localStorage.getItem("cafeName") || "",
      styles: {},
      cafeId: localStorage.getItem("cafeId") || null,
      menuItems: [],
      card: localStorage.getItem("card") || [],
      tableId: localStorage.getItem("tableId") || null,
      totalItemsCount: 0,
      menuType: "",
    };
  }

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

  getTableId = (tableIdFromParams) => {
    localStorage.setItem("tableId", tableIdFromParams);
    this.setState({ tableId: tableIdFromParams });
  };

  getTotalItemsCount = (totalItemsCountParams) => {
    this.setState({ totalItemsCount: totalItemsCountParams });
  };

  getMenuTypeName = (name) => {
    this.setState({ menuType: name });
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
          getTableId: this.getTableId,
          getTotalItemsCount: this.getTotalItemsCount,
          getMenuTypeName: this.getMenuTypeName,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
