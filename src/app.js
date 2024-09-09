import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import ProductsManager from './managers/ProductsManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new SocketIOServer(server);

const productsManager = new ProductsManager();

app.engine('handlebars', engine({defaultLayout: 'main',layoutsDir: path.join(__dirname, 'views', 'layouts'),}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Rutas
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

//Entrega 2
// Ruta para la página de inicio
app.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.render('home', { products });
    } catch (e) {
        res.status(500).send("Error al obtener los productos");
    }
});

//Ruta para Listar Productos y Agregar mediante WebSocket
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (e) {
        res.status(500).send("Error al obtener los productos");
    }
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Recibir un nuevo producto desde el cliente
    socket.on('nuevoProducto', async (data) => {
        try {
            const nuevoProducto = await productsManager.addProduct(data);
            const productosActualizados = await productsManager.getProducts();
            io.emit('productosActualizados', productosActualizados);
        } catch (e) {
            console.error("Error al agregar producto:", e);
        }
    });



    // Desconexión
    socket.on('disconnect', () => {console.log('Cliente desconectado');});
});


// Servidor
server.listen(PORT, () => {console.log(`Servidor escuchando en el puerto ${PORT}`);});
