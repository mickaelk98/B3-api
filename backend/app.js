require("dotenv").config();
const express = require("express");
const cookie = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const socket = require("socket.io");
const cors = require("cors");
const http = require("http");
require("./config/db.config");

const app = express();
const port = 4000;

//* Déclaration des routes
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

// Configuration des options Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "La documentation d'une api",
    },
    servers: [
      {
        url: "http://localhost:4001",
      },
    ],
  },
  apis: [
    `${__dirname}/routes/*.js`,
    `${__dirname}/models/*.js`,
    `${__dirname}/controller/*.js`,
  ],
};

// Initialiser Swagger avec les options
const swaggerSpec = swaggerJsdoc(swaggerOptions);
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

//* Intercepte les cookies
app.use(cookie());

//* Intercepte les requêtes JSON
app.use(express.json());

//* Configuration des CORS
app.use(cors());

//* socket.io
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

//* Liste des sockets connectés et des utilisateurs
let socketConnected = new Set();
let users = {};
let messages = [];

io.on("connection", (socket) => {
  console.log(`Un utilisateur est connecté : ${socket.id}`);
  socketConnected.add(socket.id);

  io.emit("clientsTotal", socketConnected.size);

  // Lorsqu'un utilisateur se déconnecte
  socket.on("disconnect", () => {
    console.log(`Un utilisateur est déconnecté : ${socket.id}`);
    socketConnected.delete(socket.id);
    delete users[socket.id];
    io.emit("updateUserList", users);
    io.emit("clientsTotal", socketConnected.size);
  });

  // Lorsqu'un utilisateur change son nom
  socket.on("setUsername", (username) => {
    users[socket.id] = username;
    io.emit("updateUserList", users);
  });

  // Lorsqu'un utilisateur envoie un message global
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("message", data);
  });

  // Lorsqu'un utilisateur envoie un message privé
  socket.on("privateMessage", ({ recipientId, message }) => {
    const newMessage = {
      text: message,
      author: users[socket.id],
      date: new Date().toLocaleString(),
      senderId: socket.id,
      recipientId,
    };

    // Stocke le message privé dans les conversations et envoie seulement aux destinataires
    messages.push(newMessage);
    socket.to(recipientId).emit("privateMessage", newMessage);  // Vers le destinataire
    socket.emit("privateMessage", newMessage);  // Vers l'expéditeur pour mettre à jour l'interface
  });

  // Lorsqu'un utilisateur tape un message
  socket.on("typing", ({ recipientId, feedback }) => {
    if (recipientId === "All") {
      io.emit("typing", { recipientId, feedback });  // Pour tous les utilisateurs
      // socket.broadcast.emit("typing", { recipientId, feedback });
    } else {
      socket.to(recipientId).emit("typing", { recipientId, feedback }); // Seulement pour le destinataire
    }
  });

  // Lorsqu'un utilisateur arrête de taper
  socket.on("stopTyping", (recipientId) => {
    if (recipientId === "All") {
      io.emit("typing", { recipientId, feedback: "" });
      // socket.broadcast.emit("typing", { recipientId, feedback: "" });
    } else {
      socket.to(recipientId).emit("typing", { recipientId, feedback: "" });
    }
  });
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
server.listen(port, () => {
  console.log("Serveur lancé sur le port: " + port);
});

module.exports = io;
