const { z } = require("zod");

module.exports = (req, res, next) => {
    const productValidationSchema = z.object({
        title: z
            .string({
                required_error: "Le titre est requis.",
            })
            .min(3, { message: "Le titre doit avoir au moins 3 caractères." })
            .max(50, { message: "Le titre doit avoir au maximum 50 caractères." }),

        description: z
            .string({
                required_error: "La description est requise.",
            })
            .min(10, { message: "La description doit avoir au moins 10 caractères." })
            .max(200, { message: "La description doit avoir au maximum 200 caractères." }),

        price: z
            .number({
                required_error: "Le prix est requis.",
            })
            .min(0, { message: "Le prix doit être supérieur ou égal à 0." }),
    });

    // Validation des données
    const validation = productValidationSchema.safeParse(req.body);

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