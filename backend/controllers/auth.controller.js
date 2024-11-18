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

    const userObject = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });


    const newUser = await userObject.save();
    const user = await User.findById(newUser._doc._id).select("-password");
    res.status(201).json(user);

  } catch (error) {
    res.status(404).json({ message: "erreur serveur", error });
  }
};

// controller de connexion
exports.login = async (req, res) => {

  // recherche l'utilisateur dans la base de donnée
  const user = await User.findOne({ email: req.body.email });


  // si l'utilisateur n'existe pas
  if (!user) {
    return res
      .status(401)
      .json({ message: "Identifiant ou mot de pass invalide" });
  } else {
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    // si le mot de passe de la requete ne correspond pas a celui dans la base de donnée
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Identifiant ou mot de pass invalid" });
    } else {
      const newUser = await User.findById(user._id).select("-password");
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_KEY,
        {
          // validité du token (7 jours)
          expiresIn: 3600 * 24 * 7,
        }
      );
      // renvoi l'utilisateur et un token pour identifier chaque requete
      res.status(200).json({ newUser, token });
    }
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    // recuperation du token
    const { token } = req.cookies;
    if (token) {

      // verification de l'authenticité du token et erecuperation du user
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      const currentUser = await User.findById(decodedToken.userId).select("-password");

      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.status(401).json(null);
      }


    } else {
      res.status(401).json(null);
    }
  } catch (err) {
    res.status(401).json(null);
  }
}
// controller de deconnexion
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "cookie supprimé" });
};


