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
import StudentRoute from "./StudentRoute";
import ModeratorRoute from "./ModeratorRoute";
import AdminAnalytics from "../pages/Admin/AdminAnalytics";

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
        element: <AdminRoute><AddScholarship></AddScholarship></AdminRoute>
      },
      {
        path: 'manage-scholarships',
       element: <AdminRoute><ManageScholarships></ManageScholarships></AdminRoute>
      },
      {
        path: 'manage-users',
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
      },
      {
        path: 'analytics',
        element: <AdminRoute><AdminAnalytics></AdminAnalytics></AdminRoute>
      },
      {
        path: 'manage-applications',
        element: <ModeratorRoute><ManageApplications></ManageApplications></ModeratorRoute>
      },
      {
        path: 'all-reviews',
        element: <ModeratorRoute><AllReviews></AllReviews></ModeratorRoute>
      },
      {
        path: 'my-applications',
        element: <StudentRoute><MyApplications></MyApplications></StudentRoute>
      },
      {
        path: 'my-reviews',
        element: <StudentRoute><MyReviews></MyReviews></StudentRoute>
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
