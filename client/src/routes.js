import { useMemo } from "react";
import { Route } from "react-router-dom";
import {
  AboutUs,
  AdminAuh,
  Cafe,
  MenuType,
  Card,
  MenuItem,
  ErrorPage,
  AdminPage,
  Blank,
} from "./screens/index";

export const appRoutes = [
  {
    path: "/",
    name: "aboutUs",
    exact: true,
    component: AboutUs,
  },

  {
    path: "/:cafeName/:cafeId/:tableId",
    name: "aboutUs",
    exact: true,
    component: Cafe,
  },

  {
    path: "/:cafeName/:cafeId/:tableId/menuType/:menuType",
    name: "menuType",
    exact: true,
    component: MenuType,
  },

  {
    path: "/:cafeName/:cafeId/:tableId/card",
    name: "menuType",
    component: Card,
  },

  {
    path: "/:cafeName/:cafeId/:tableId/item/:itemId",
    name: "menuType",
    component: MenuItem,
  },

  {
    path: "/admin-panel",
    name: "AdminAuh",
    exact: true,
    component: AdminAuh,
  },

  {
    path: "/admin-panel/dashboard/:cafeId/:cafeName",
    name: "menuType",
    exact: true,
    component: AdminPage,
  },

  {
    path: "*",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

export const renderRoutes = (routeProps = {}) => {
  return appRoutes.map((route) => {
    return (
      <Route
        key={`structure-route-${route.name}`}
        path={route.path}
        exact={route.exact}
        render={(props) => {
          if (route.component) {
            return (
              <route.component
                {...routeProps}
                {...props}
                routes={route.routes}
              />
            );
          }

          return null;
        }}
      />
    );
  });
};

export const useRoutes = () => useMemo(() => renderRoutes(), []);
