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
  AdminPanelHome,
  AdminPanelMenuTypes,
  AdminPanelMenuItems,
  AdminPanelMenuTypesItem,
  AdminPanelTables,
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
    path: "/admin-panel/auth",
    name: "AdminAuh",
    exact: true,
    component: AdminAuh,
  },

  {
    path: "/admin-panel/:cafeId/:cafeName/dashboard/home",
    name: "adminPanelHome",
    exact: true,
    component: AdminPanelHome,
  },

  {
    path: "/admin-panel/:cafeId/:cafeName/dashboard/menuTypes",
    name: "adminPanelMenuTypes",
    exact: true,
    component: AdminPanelMenuTypes,
  },

  {
    path: "/admin-panel/:cafeId/:cafeName/dashboard/menuTypes/:menuType",
    name: "adminPanelMenuTypes",
    exact: true,
    component: AdminPanelMenuTypesItem,
  },

  {
    path: "/admin-panel/:cafeId/:cafeName/dashboard/tables",
    name: "adminPanelMenuTypes",
    exact: true,
    component: AdminPanelTables,
  },

  {
    path: "/admin-panel/:cafeId/:cafeName/dashboard/menuItems",
    name: "adminPanelMenuTypes",
    exact: true,
    component: AdminPanelMenuItems,
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
