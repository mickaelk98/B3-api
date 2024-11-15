/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du produit
 *         title:
 *           type: string
 *           description: Titre du produit
 *         description:
 *           type: string
 *           description: Description du produit
 *         price:
 *           type: number
 *           description: Prix du produit
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de cr ation du produit
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de la derni re mise   jour du produit
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit cr  avec succ s
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requ te invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Récuperer la liste de tous les produits
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste de tous les produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Récuperer un produit par son ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: D tails du produit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouv
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Mettre à jour un produit
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit mis jour à avec succès    
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requ te invalide
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprim  avec succ s
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
const auth = require("../middleware/auth");
const validateProduct = require("../middleware/validateProduct");

router.get("/", auth, productCtrl.getAllProducts);
router.get("/:id", auth, productCtrl.getProductById);
router.post("/", auth, validateProduct, productCtrl.createProduct);
router.put("/:id", auth, validateProduct, productCtrl.updateProduct);
router.delete("/:id", auth, productCtrl.deleteProduct);

module.exports = router;
