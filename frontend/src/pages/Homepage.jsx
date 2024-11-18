import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Homepage() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {!user ? (
        <Navigate to="/signup" />
      ) : (
        <div>
          <h1>Home page</h1>
        </div>
      )}
    </>
  );
}

export default Homepage;
