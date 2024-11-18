import { useForm } from "react-hook-form";
import { Navigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({ required_error: "L'adresse email est requise." })
    .email({ message: "Veuillez fournir une adresse email valide." }),
  password: z
    .string({ required_error: "Le mot de passe est requis." })
    .min(6, { message: "Le mot de passe doit avoir au moins 6 caractères." }),
});

const Login = () => {
  const { user, loginUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data, event) => {
    event.preventDefault();
    await loginUser(data);
  };

  return (
    <>
      {user ? (
        <Navigate to="/chat" />
      ) : (
        <div className="max-w-3xl w-[500px] mx-auto bg-gray-200 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Connexion</h1>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Champ Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Adresse Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } rounded-lg shadow-sm focus:outline-none`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Champ Mot de Passe */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Mot de Passe
              </label>
              <input
                type="password"
                id="password"
                className={`w-full px-4 py-2 border ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } rounded-lg shadow-sm focus:outline-none`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Se connecter
            </button>
          </form>
          <NavLink to="/signup">
            <span className="my-5 block">Je n'ai pas de compte</span>
          </NavLink>
        </div>
      )}
    </>
  );
};

export default Login;
