import express from 'express'
import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js';
import ordersRouter from './routes/orders.routes.js';

const app = express();

app.use(express.json());

app.use('/api', productsRouter);
app.use('/api', usersRouter);
app.use('/api', ordersRouter);

app.listen(3000, () => {
    console.log("server on port 3000");
});