const { z } = require("zod");

module.exports = (req, res, next) => {
    const orderValidationSchema = z.object({
        userId: z
            .string({
                required_error: "L'ID de l'utilisateur est requis.",
            })
            .uuid({ message: "L'ID de l'utilisateur doit être un UUID valide." }),

        productIds: z
            .array({
                required_error: "La liste des produits est requise.",
            })
            .nonEmpty({ message: "La liste des produits ne peut pas être vide." })
            .of(
                z.object({
                    productId: z
                        .string({
                            required_error: "L'ID du produit est requis.",
                        })
                        .uuid({ message: "L'ID du produit doit être un UUID valide." }),

                    quantity: z
                        .number({
                            required_error: "La quantité est requise.",
                        })
                        .min(1, { message: "La quantité doit être supérieure ou égale à 1." }),
                })
            ),
    });

    // Validation des données
    const validation = orderValidationSchema.safeParse(req.body);

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