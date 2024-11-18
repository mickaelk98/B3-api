import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signup, login } from "../services";

function AuthProvider({ children }) {
  const initialUser = useLoaderData();
  const [user, setUser] = useState(initialUser);

  async function signupUser(data) {
    const { email, password } = data;
    await signup(data);
    const user = await login({ email, password });
    setUser(user);
  }

  async function loginUser(data) {
    const user = await login(data);
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ user, signupUser, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
