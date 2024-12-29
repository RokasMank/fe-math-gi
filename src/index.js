import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LoginScreen from "./StudentScreens/LoginScreen/LoginScreen.jsx";
import AdminLoginScreen from "./AdminScreens/LoginScreen/LoginScreen.jsx";
import reportWebVitals from "./reportWebVitals";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Common/ErrorPage.jsx";
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
import AppLayout from "./Common/AppLayoutDraft.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

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
    path: "admin/landing",
    element: <LandingScreen />,
  },
  {
    path: "admin/create",
    element: <AdminCreateScreen />,
  },
  {
    path: "admin/add-student",
    element: <CreateStudentScreen />,
  },
  {
    path: "admin/create-test",
    element: <CreateTestScreen />,
  },
  {
    path: "admin/create-test/add-questions/:testId",
    element: <AddTestTestQuestionsScreen />,
  },
  {
    path: "admin/all-tests",
    element: <AllTestsScreen />,
  },
  {
    path: "admin/test/:id",
    element: <TestDetailsScreen />,
  },
  {
    path: "admin/create-assignment",
    element: <CreateTestAssignmentScreen />,
  },
  {
    path: "admin/view-assignments",
    element: <ViewTestAssignmentsScreen />,
  },
  {
    path: "admin/view-assignment/:id",
    element: <ViewAssignmentDetailsScreen />,
  },
  {
    path: "main",
    element: <StudentMain />,
  },
  {
    path: "test/:id",
    element: <StudentTestPage />,
  },
  {
    path: "results/:id",
    element: <TestResultsPage />,
  },
]);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router}>
        <AppLayout />
      </RouterProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
