import express from 'express';
import CartsManager from '../managers/CartsManager.js';
import ProductsManager from '../managers/ProductsManager.js';

const router = express.Router();
const cartsManager = new CartsManager();
const productsManager = new ProductsManager();

// Ruta para obtener carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsManager.getCartById(parseInt(cid));
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        const allProducts = await productsManager.getProducts();
        const detailedProducts = cart.products.map(cartProduct => {
            const fullProductDetails = allProducts.find(p => p.id === cartProduct.product);
            return {
                ...fullProductDetails,
                quantity: cartProduct.quantity
            };
        });

        res.status(200).send({ products: detailedProducts });
    } catch (e) {
        res.status(500).send("Error al consultar el carrito");
    }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.addCart();
        res.status(201).send({ cart: newCart });
    } catch (e) {
        res.status(500).send("Error al crear un nuevo carrito");
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsManager.getCartById(parseInt(cid));
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        const product = await productsManager.getProductById(parseInt(pid));
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        const updatedCart = await cartsManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.status(201).send({ cart: updatedCart });
    } catch (e) {
        res.status(500).send("Error al agregar el producto al carrito");
    }
});

export default router;
