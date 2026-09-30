import { Route, Routes } from "react-router-dom";
import appRoutes, { type AppRoute } from "./config/appRoutes";

// Recursive: `AppRoute.children` may itself carry children, and a renderer
// that only walks one level type-checks against a grandchild route and then
// never renders it.
function renderRoute(route: AppRoute, key: string) {
  if (route.index) return <Route key={key} index element={route.element} />;
  return (
    <Route key={key} path={route.path} element={route.element}>
      {route.children?.map((child, i) => renderRoute(child, child.path ?? `index-${i}`))}
    </Route>
  );
}

export default function App() {
  return <Routes>{appRoutes.map((route, i) => renderRoute(route, route.path ?? `layout-${i}`))}</Routes>;
}
