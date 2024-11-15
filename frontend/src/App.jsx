import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <header></header>
      <main className="flex justify-center items-center w-full h-screen">
        <Outlet />
      </main>
    </>
  );
}
export default App;
