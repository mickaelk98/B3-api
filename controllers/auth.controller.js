const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// controller d'inscription
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déja" });
    }

    if (!username) {
      res.status(404).json({ message: "Le mnom est obligatoire" });
    } else if (!email) {
      res.status(404).json({ message: "L'email est obligatoire" });
    } else if (!password) {
      res.status(404).json({ message: "Le mot de passe est obligatoire" });
    } else if (!role) {
      res.status(404).json({ message: "Le role est obligatoire" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(username, email, password, role);
    const userObject = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });


    const newUser = await userObject.save();
    res.status(201).json({
      message: "L'utilisateur a bien été crée !",
      user: newUser,
    });

    // si la l'inscription s'est bien passé
    res.status(201).json({ message: "votre compte a été crée" });
  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

// controller de connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // recherche l'utilisateur dans la base de donnée
  const user = await User.findOne({ email: req.body.email });

  // si l'utilisateur n'existe pas
  if (!user) {
    return res
      .status(401)
      .json({ message: "Identifiant ou mot de pass invalid" });
  } else {
    const validPassword = await bcrypt.compare(password, user.password);

    // si le mot de passe de la requete ne correspond pas a celui dans la base de donnée
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Identifiant ou mot de pass invalid" });
    } else {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_KEY,
        {
          // validité du token (7 jours)
          expiresIn: 3600 * 24 * 7,
        }
      );

      // renvoi l'utilisateur et un token pour identifier chaque requete
      res.cookie("token", token);
      res.status(200).json({ user, token });
    }
  }
};

// controller de deconnexion
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "cookie supprimé" });
};