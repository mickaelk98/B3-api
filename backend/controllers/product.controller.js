const Product = require("../models/Products");

exports.createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body });
    await product.save();
    res.status(201).json({
      message: "Le produit a bien été crée !",
      product: req.body,
    });
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.updateProduct = async (req, res) => {
  try {

    //* recuperation du produit
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Cet produit n'existe pas" });
    }

    const title = req.body.title ? req.body.title : product.title;
    const description = req.body.description
      ? req.body.description
      : product.description;
    const price = req.body.price ? req.body.price : product.price;

    //* verifie que celui qui fait la requete est admin
    if (req.role !== "admin") {
      return res.status(401).json({ message: "Requete non authorisée" });
    }

    await Product.updateOne(
      { _id: productId },
      { title, description, price, _id: productId }
    );
    const newproduct = await Product.findOne({ _id: productId });
    res.status(201).json(newproduct);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    //* recuperation de l'utilisateur
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Ce produit n'existe pas" });
    }

    //* verifie que celui qui fait la requete est admin
    if (req.role !== "admin") {
      return res.status(401).json({ message: "Requete non authorisée" });
    }

    await Product.deleteOne({ _id: productId });
    res.status(200).json({ message: `Le produit a bien été supprimé` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
