const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis."], // Champ obligatoire avec message d'erreur
      trim: true, // Supprime les espaces en début et fin de chaîne
    },
    description: {
      type: String,
      required: [true, "La description est requise."], // Champ obligatoire
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis."], // Champ obligatoire
      min: [0, "Le prix doit être supérieur ou égal à 0."], // Validation du prix minimum
    },
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);

// Créer le modèle Product basé sur le schéma
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
