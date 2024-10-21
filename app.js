require("dotenv").config();
const express = require("express");
const cookie = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("./config/db.config");

const app = express();
const port = 4001;

//* declaration des routes
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

// Configuration des options Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Version de l'OpenAPI spécification
    info: {
      title: "API Documentation", // Titre de la documentation
      version: "1.0.0", // Version de l'API
      description: "La documentation d'une api", // Description
    },
    servers: [
      {
        url: "http://localhost:4001", // URL de base de l'API
      },
    ],
  },
  apis: [
    `${__dirname}/routes/*.js`,
    `${__dirname}/models/*.js`,
    `${__dirname}/controller/*.js`,
  ], // Indique où se trouvent les fichiers contenant les routes et la documentation
};

// Initialiser Swagger avec les options
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Utiliser Swagger UI à l'endpoint /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//* intercepte les coockies
app.use(cookie());

//* intercepte les requete json
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.listen(port, () => {
  console.log("Serveur lancé sur le port: " + port);
});
