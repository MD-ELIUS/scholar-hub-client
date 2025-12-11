import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import MyProfile from "../pages/DashboardPage/MyProfile";
import DashboardHomeLayout from "../pages/DashboardPage/DashboardHomeLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
            path:'/register',
            Component: Register
        },
         {
            path:'/login',
            Component: Login
        }
    ]
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
        {
           
           Component: DashboardHomeLayout
        },
        {
          path: 'profile',
          Component: MyProfile
        }
    ]
  }
]);
