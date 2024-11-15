/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de l'utilisateur
 *         username:
 *           type: string
 *           description: Le nom d'utilisateur unique
 *           example: johndoe123
 *         email:
 *           type: string
 *           description: L'adresse email unique de l'utilisateur
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: Le mot de passe de l'utilisateur, haché pour la sécurité
 *           example: $2b$10$7Zw3hZIvRr1PC4FL5Gd4FurGv7Q.uONgMQP.xLI2F7bcH/yUPAqQa
 *         role:
 *           type: string
 *           enum: ["user", "admin"]
 *           description: Le rôle de l'utilisateur dans le système
 *           example: user
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nouveau nom d'utilisateur
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nouvelle adresse email
 *               password:
 *                 type: string
 *                 description: Nouveau mot de passe
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: Nouveau rôle
 *     responses:
 *       201:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Requête non autorisée
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const auth = require("../middleware/auth.js");
const validateUser = require("../middleware/validateUser");

router.get("/", auth, userCtrl.getAllUsers);
router.get("/:id", auth, userCtrl.getUserById);
router.put("/:id", validateUser, auth, userCtrl.updateUser);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
