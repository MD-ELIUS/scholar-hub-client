import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import MyProfile from "../pages/DashboardPage/MyProfile";
import DashboardHomeLayout from "../pages/DashboardPage/DashboardHomeLayout";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "../pages/Admin/ManageUsers";
import AdminRoute from "./AdminRoute";
import AddScholarship from "../pages/Admin/AddScholarship";
import ManageScholarships from "../pages/Admin/ManageScholarships";
import AllScholarshipsPage from "../pages/AllScholarshipPage/AllScholarshipsPage";
import ScholarshipDetails from "../pages/ScholarshipDetails/ScholarshipDetails";
import Payment from "../pages/Student/Payment";
import PaymentSuccess from "../pages/Student/PaymentSuccess";
import PaymentCancelled from "../pages/Student/PaymentCancelled";
import MyApplications from "../pages/Student/MyApplications";
import MyReviews from "../pages/Student/MyReviews";
import ManageApplications from "../pages/Moderator/ManageApplications";
import AllReviews from "../pages/Moderator/AllReviews";

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
        path: '/all-scholarships',
        Component: AllScholarshipsPage
      },
      {
        path: "/scholarships/:id",
        element: <ScholarshipDetails />,
      },
      {
        path: '/register',
        Component: Register
      },
      {
        path: '/login',
        Component: Login
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
        index: true,
        Component: DashboardHomeLayout
      },
      {
        path: 'profile',
        Component: MyProfile
      },
      {
        path: 'add-scholarship',
        Component: AddScholarship
      },
      {
        path: 'manage-scholarships',
        Component: ManageScholarships
      },
      {
        path: 'manage-users',
        element: <ManageUsers></ManageUsers>
      },
      {
        path: 'manage-applications',
        element: <ManageApplications></ManageApplications>
      },
      {
        path: 'all-reviews',
        element: <AllReviews></AllReviews>
      },
      {
        path: 'my-applications',
        element: <MyApplications></MyApplications>
      },
      {
        path: 'my-reviews',
        element: <MyReviews></MyReviews>
      },
      {
        path: 'payment/:scholarshipId',
        element: <Payment></Payment>
      },
      {
        path: 'payment-success',
        Component: PaymentSuccess
      },
      {
        path: 'payment-cancelled',
        Component: PaymentCancelled
      }
    ]
  }
]);
