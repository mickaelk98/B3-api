import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";

async function loader() {
  try {
    const response = await fetch("http://localhost:4000/api/auth/", {
      method: "GET",
      credentials: "include",
    });
    const user = await response.json();

    if (response.ok) {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    loader: loader,
    element: <App />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
]);
