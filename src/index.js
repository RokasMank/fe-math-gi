import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LoginScreen from "./StudentScreens/LoginScreen/LoginScreen.jsx";
import AdminLoginScreen from "./AdminScreens/LoginScreen/LoginScreen.jsx";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Common/ErrorPage.jsx";
import StudentMain from "./StudentScreens/MainScreen/StudentMain.jsx";
import LandingScreen from "./AdminScreens/LandingScreen/LandingScreen.jsx";
import AdminCreateScreen from "./AdminScreens/Main/AdminCreateScreen.jsx";
import AddStudentScreen from "./AdminScreens/Main/AddStudentScreen.jsx";
import CreateTestScreen from "./AdminScreens/Main/CreateTestScreen.jsx";
import AddTestTestQuestionsScreen from "./AdminScreens/Main/AddTestQuestionsScreen.jsx";

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
    element: <AddStudentScreen />,
  },
  {
    path: "admin/create-test",
    element: <CreateTestScreen />,
  },
  {
    path: "admin/create-test/add-questions",
    element: <AddTestTestQuestionsScreen />,
  },
  {
    path: "main",
    element: <StudentMain />,
  },
]);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
