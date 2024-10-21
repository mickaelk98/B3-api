
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - productIds
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de la commande
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur qui a pass  la commande
 *           ref: "#/components/schemas/User"
 *         productIds:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID du produit
 *                 ref: "#/components/schemas/Product"
 *               quantity:
 *                 type: integer
 *                 description: quantité du produit
 */
/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Récuperer la liste de toutes les commandes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Liste de toutes les commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Requète non autorisée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/order/one-order/{orderId}:
 *   get:
 *     summary: Récuperer une commande par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Détails de la commande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/order/user-order/{userId}:
 *   get:
 *     summary: Récuperer les commandes d'un utilisateur par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des commandes de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande cr e avec succ s
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Requète invalide
 *       401:
 *         description: Requète non autorisée
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /api/order/{orderId}:
 *   put:
 *     summary: Mettre à jour une commande par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID de l'utilisateur
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID du produit
 *                     quantity:
 *                       type: integer
 *                       description: quantit  du produit
 *     responses:
 *       200:
 *         description: Commande mise  jour avec succ s
 *       400:
 *         description: Requ te invalide
 *       404:
 *         description: Commande non trouv e
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /api/order/{orderId}:
 *   delete:
 *     summary: Supprimer une commande par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprim e avec succ s
 *       404:
 *         description: Commande non trouv e
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/order/{userId}:
 *   delete:
 *     summary: Supprimer les commandes d'un utilisateur par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Commandes de l'utilisateur supprim es avec succ s
 *       404:
 *         description: Utilisateur non trouv 
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/order:
 *   delete:
 *     summary: Supprimer toutes les commandes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Toutes les commandes supprim es avec succ s
 *       500:
 *         description: Erreur serveur
 */

const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");
const auth = require("../middleware/auth");
const validateOrder = require("../middleware/validateOrder");

router.get("/", auth, orderCtrl.getAllOrders);
router.get("/one-order/:orderId", auth, orderCtrl.getOneOrders);
router.get("/user-order/:userId", auth, orderCtrl.getUserOrders);
router.post("/", auth, validateOrder, orderCtrl.createOrder);
router.put("/:orderId", auth, validateOrder, orderCtrl.updateOrder);
router.delete("/:orderId", auth, orderCtrl.deleteOrder);
router.delete("/:userId", auth, orderCtrl.deleteUserOrders);
router.delete("/", auth, orderCtrl.deleteAllOrders);

module.exports = router;

