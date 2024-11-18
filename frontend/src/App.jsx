import { Outlet } from "react-router-dom";
import "./App.css";
import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <main className="flex justify-center items-center w-full h-screen">
        <Outlet />
      </main>
    </AuthProvider>
  );
}
export default App;
