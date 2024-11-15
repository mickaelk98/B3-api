const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // recuperation du token
    const { token } = req.cookies;

    if (token) {
      // verification de l'authenticité du token et extraction de l'id
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      req.userId = decodedToken.userId;
      req.role = decodedToken.role;

      // passe au controller suivant
      next();
    } else {
      res.status(401).json({ message: "Requete non authentifié" });
    }
  } catch (err) {
    res.status(401).json({ message: "Requete non authentifié", err });
  }
};
