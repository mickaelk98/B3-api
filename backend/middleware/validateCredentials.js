const { z } = require("zod");

module.exports = (req, res, next) => {
  const userValidationSchema = z.object({
    email: z
      .string({
        required_error: "L'adresse email est requise.", // Gère le cas où le champ est absent
      })
      .email({ message: "Veuillez fournir une adresse email valide." }),

    password: z
      .string({
        required_error: "Le mot de passe est requis.", // Gère le cas où le champ est absent
      })
      .min(6, { message: "Le mot de passe doit avoir au moins 6 caractères." }),
  });

  // Validation des données
  const validation = userValidationSchema.safeParse(req.body);

  if (!validation.success) {
    // Collecte des messages d'erreur
    const errorMessages = validation.error.issues.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  } else {
    next();
  }
};
