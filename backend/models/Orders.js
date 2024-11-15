const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Référence à un utilisateur dans la collection Users
      required: [true, "L'ID de l'utilisateur est requis."],
      ref: "User", // Référence à un autre modèle, par exemple, User
    },
    productIds: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, // Référence à un produit dans la collection Products
          required: [true, "L'ID du produit est requis."],
          ref: "Product", // Référence à un autre modèle, par exemple, Product
        },
        quantity: {
          type: Number,
          required: [true, "La quantité est requise."],
          min: [1, "La quantité doit être au moins 1."], // Validation pour s'assurer que la quantité est positive
        },
      },
    ],
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);

// Créer le modèle Order basé sur le schéma
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
