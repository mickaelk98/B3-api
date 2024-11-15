import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "../services";

// Définir le schéma de validation Zod
const userValidationSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Le nom d'utilisateur doit avoir au moins 3 caractères.",
    })
    .max(30, {
      message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
    })
    .nonempty({ message: "Le nom d'utilisateur est requis." }),
  email: z
    .string()
    .email({ message: "Veuillez fournir une adresse email valide." })
    .nonempty({ message: "L'adresse email est requise." }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit avoir au moins 6 caractères." })
    .nonempty({ message: "Le mot de passe est requis." }),
  role: z.enum(["user", "admin"]).optional(), // Optionnel
});

const Signup = () => {
  // Utilisation de React Hook Form avec Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userValidationSchema),
  });

  // Fonction de soumission du formulaire
  const onSubmit = async (data) => {
    const user = await signup(data);
    console.log("utilisateur de la base de donnée : ", user);
  };

  return (
    <div className="max-w-3xl w-[500px] mx-auto bg-gray-200 rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Inscription</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Champ Username */}
        <div>
          <label htmlFor="username" className="block text-gray-800 font-medium">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            className="w-full bg-gray-100 text-gray-800 rounded-lg shadow-sm p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Champ Email */}
        <div>
          <label htmlFor="email" className="block text-gray-800 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full bg-gray-100 text-gray-800 rounded-lg shadow-sm p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Champ Password */}
        <div>
          <label htmlFor="password" className="block text-gray-800 font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="w-full bg-gray-100 text-gray-800 rounded-lg shadow-sm p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Champ Role (Optionnel) */}
        <div>
          <label htmlFor="role" className="block text-gray-800 font-medium">
            Rôle (Optionnel)
          </label>
          <select
            id="role"
            className="w-full bg-gray-100 text-gray-800 rounded-lg shadow-sm p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("role")}
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Bouton Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-lg shadow-lg p-2 font-medium hover:bg-blue-600 transition"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Signup;
