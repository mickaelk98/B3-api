const Order = require("../models/Orders");

exports.createOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body });
    await order.save();
    res.status(201).json({ message: "La commande a bien été crée !" });
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.getOneOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Cette commande n'existe pas" });
    }

    const userId = req.body.userId ? req.body.userId : order.userId;
    const productIds = req.body.productIds
      ? req.body.productIds
      : order.productIds;


    await Order.updateOne(
      { _id: orderId },
      { userId, productIds, _id: orderId }
    );

    res.status(200).json({ message: "La commande a bien été modifiée" });
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Cette commande n'existe pas" });
    }

    await Order.deleteOne({ _id: orderId });
    res.status(200).json({ message: `La commande a bien été supprimé` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    await Order.deleteMany({ userId });
    res.status(200).json({ message: `Les commandes de l'utilisateur ont bien été supprimées` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json({ message: "Toutes les commandes ont bien été supprimées" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
