import { Navigate, type RouteProps } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TodoListPage from "../pages/TodoList";

export interface AppRoute extends Omit<RouteProps, "children"> {
  children?: AppRoute[];
  label?: string;
}

// One screen — TodoList — per wireframes.dsl. No sign-in, so every route is
// reachable directly; "/" lands on the only screen the app has.
const appRoutes: AppRoute[] = [
  { path: "/", element: <Navigate to="/todo-list" replace /> },
  {
    element: <AppLayout />,
    children: [{ path: "/todo-list", element: <TodoListPage />, label: "TodoList" }],
  },
];

export default appRoutes;
