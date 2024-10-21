/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur
 *               email:
 *                 type: string
 *                 format: email
 *                 description: L'adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: Le rôle de l'utilisateur
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "L'utilisateur a bien été crée !"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: L'utilisateur existe déjà
 *       404:
 *         description: Champs obligatoires manquants ou erreur serveur
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: L'adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Le token JWT pour l'authentification
 *       401:
 *         description: Identifiant ou mot de passe invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie, cookie supprimé
 *       500:
 *         description: Erreur serveur
 */

const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");
const validateSignin = require("../middleware/validateSignin");
const validateCredentials = require("../middleware/validateCredentials");

router.post("/signup", validateSignin, authCtrl.signup);
router.post("/login", validateCredentials, authCtrl.login);
router.post("/logout", authCtrl.logout);

module.exports = router;
