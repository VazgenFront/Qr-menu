import { Switch, Route } from "react-router-dom";
import { MainPage,AdminAuth } from "./screens/index";

export const routes = {
  homePage: "/",
  adminSide: "/admin-panel",
  adminAuth: "/admin-panel/:cafeName",
  userSide: "/:cafeName/:seatId",
  userCard: "/:cafeName/:seatId/card",
};

export const switchingRoutes = () => {
  return (
    <Switch>
      <Route exact path={routes.homePage} render={() => <MainPage />} />
      <Route exact path={routes.adminSide} render={() => <AdminAuth />} />
      <Route exact path={routes.adminAuth} render={() => <MainPage />} />
      <Route exact path={routes.userSide} render={() => <MainPage />} />
      <Route exact path={routes.userCard} render={() => <MainPage />} />
    </Switch>
  );
};
