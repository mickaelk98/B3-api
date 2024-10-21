const { z } = require("zod");

module.exports = (req, res, next) => {
  const userValidationSchema = z.object({
    username: z
      .string({
        required_error: "Le nom d'utilisateur est requis.", // Gère le cas où le champ est absent
      })
      .min(3, {
        message: "Le nom d'utilisateur doit avoir au moins 3 caractères.",
      })
      .max(30, {
        message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
      })
      .nonempty({ message: "Le nom d'utilisateur est requis." }), // Gère le champ vide

    email: z
      .string({
        required_error: "L'adresse email est requise.", // Gère le cas où le champ est absent
      })
      .email({ message: "Veuillez fournir une adresse email valide." })
      .nonempty({ message: "L'adresse email est requise." }), // Gère le champ vide

    password: z
      .string()
      .min(6, { message: "Le mot de passe doit avoir au moins 6 caractères." })
      .optional(), // Le champ est optionnel
    // Pas de .nonempty() ici puisque le mot de passe est optionnel

    role: z.enum(["user", "admin"]).optional(), // Zod infère automatiquement la valeur par défaut si vous le gérez ailleurs
  });

  // Validation des données
  const validation = userValidationSchema.safeParse(req.body);

  // Log pour déboguer
  console.log("Validation result:", JSON.stringify(validation, null, 2)); // Log plus détaillé

  if (!validation.success) {
    // Collecte des messages d'erreur
    const errorMessages = validation.error.issues.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  } else {
    next();
  }
};
