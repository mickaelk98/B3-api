const User = require("../models/Users");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Cet utilisateur n'existe pas" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    //* recuperation de l'utilisateur
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Cet utilisateur n'existe pas" });
    }

    const username = req.body.username ? req.body.username : user.username;
    const email = req.body.email ? req.body.email : user.email;
    const password = req.body.password
      ? await bcrypt.hash(req.body.password, 10)
      : user.password;
    const role = req.body.role ? req.body.role : user.role;

    //* verifie que celui qui fait la requete est bien le createur de la ressource ou est admin
    if (userId !== req.userId || user.role !== "admin") {
      return res.status(401).json({ message: "Requete non authorisée" });
    }

    await User.updateOne(
      { _id: userId },
      { username, email, password, role, _id: userId }
    );
    const newUser = await User.findOne({ _id: userId });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //* recuperation de l'utilisateur
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Cet utilisateur n'existe pas" });
    }

    //* verifie que celui qui fait la requete est bien le createur de la ressource ou est admin
    if (userId !== req.userId || user.role !== "admin") {
      return res.status(401).json({ message: "Requete non authorisée" });
    }


    const username = user.username;
    await User.deleteOne({ _id: userId });
    res
      .status(200)
      .json({ message: `L'utilisateur ${username} a bien été supprimé` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
