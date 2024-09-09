import express from 'express';
import ProductsManager from '../managers/ProductsManager.js';

const router = express.Router();
const productsManager = new ProductsManager();

// Ruta para listar todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.status(200).send({ products });
    } catch (e) {
        console.log("Error al listar los productos");
        res.status(500).send("Error en Productos");
    }
});

// Ruta para obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const parseId = parseInt(pid);
        const product = await productsManager.getProductById(parseId);

        if (!product) {
            return res.status(403).send("Producto no encontrado");
        }

        res.status(200).send({ product });
    } catch (e) {
        res.status(500).send("Error al buscar el producto por ID");
    }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productsManager.addProduct(productData);
        res.status(201).send({ product: newProduct });
    } catch (e) {
        res.status(500).send("Error al agregar un producto");
    }
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProductData = req.body;
        const updatedProduct = await productsManager.updateProduct(parseInt(pid), updatedProductData);

        if (!updatedProduct) {
            return res.status(404).send("Producto no encontrado");
        }

        res.status(200).send({ product: updatedProduct });
    } catch (e) {
        res.status(500).send("Error al actualizar el producto");
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const isDeleted = await productsManager.deleteProduct(parseInt(pid));

        if (!isDeleted) {
            return res.status(404).send("Producto no encontrado");
        }

        res.status(200).send({ message: "Producto eliminado correctamente" });
    } catch (e) {
        res.status(500).send("Error al eliminar el producto");
    }
});

export default router;
