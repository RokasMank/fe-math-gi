import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ErrorPage from "./Common/ErrorPage.jsx";
import LoginScreen from "./StudentScreens/LoginScreen/LoginScreen.jsx";
import AdminLoginScreen from "./AdminScreens/LoginScreen/LoginScreen.jsx";
import StudentMain from "./StudentScreens/MainScreen/StudentMain.jsx";
import LandingScreen from "./AdminScreens/LandingScreen/LandingScreen.jsx";
import AdminCreateScreen from "./AdminScreens/Main/AdminCreateScreen.jsx";
import CreateStudentScreen from "./AdminScreens/Main/CreateStudentScreen.jsx";
import CreateTestScreen from "./AdminScreens/Main/CreateTestScreen.jsx";
import AddTestTestQuestionsScreen from "./AdminScreens/Main/AddTestQuestionsScreen.jsx";
import AllTestsScreen from "./AdminScreens/Main/AllTestsScreen.jsx";
import CreateTestAssignmentScreen from "./AdminScreens/Main/CreateTestAssignmentScreen.jsx";
import TestDetailsScreen from "./AdminScreens/Main/TestDetailsScreen.jsx";
import ViewTestAssignmentsScreen from "./AdminScreens/Main/ViewTestAssignments.jsx";
import ViewAssignmentDetailsScreen from "./AdminScreens/Main/ViewAssignmentDetailsScreen.jsx";
import StudentTestPage from "./StudentScreens/MainScreen/StudentTestPage.jsx";
import TestResultsPage from "./StudentScreens/MainScreen/TestResultsPage.jsx";
import Layout from "./Common/Layout";

const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: "admin/login",
    element: <AdminLoginScreen />,
  },
  {
    path: "admin",
    element: <AppLayout />,
    children: [
      { path: "landing", element: <LandingScreen /> },
      { path: "create", element: <AdminCreateScreen /> },
      { path: "add-student", element: <CreateStudentScreen /> },
      { path: "create-test", element: <CreateTestScreen /> },
      {
        path: "create-test/add-questions/:testId",
        element: <AddTestTestQuestionsScreen />,
      },
      { path: "all-tests", element: <AllTestsScreen /> },
      { path: "test/:id", element: <TestDetailsScreen /> },
      { path: "create-assignment", element: <CreateTestAssignmentScreen /> },
      { path: "view-assignments", element: <ViewTestAssignmentsScreen /> },
      { path: "view-assignment/:id", element: <ViewAssignmentDetailsScreen /> },
    ],
  },
  {
    path: "main",
    element: <AppLayout />,
    children: [{ path: "", element: <StudentMain /> }],
  },
  {
    path: "test/:id",
    element: <AppLayout />,
    children: [{ path: "", element: <StudentTestPage /> }],
  },
  {
    path: "results/:id",
    element: <AppLayout />,
    children: [{ path: "", element: <TestResultsPage /> }],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

reportWebVitals();
