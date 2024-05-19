import express from 'express'
import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js';
import ordersRouter from './routes/orders.routes.js';
import { createFirstAdmin } from './helpers/utis.js';
import cartRouter from './routes/carts.routes.js';

const {ADMIN_SECRET} = process.env;

const app = express();

app.use(express.json());

app.use('/api', productsRouter);
app.use('/api', usersRouter);
app.use('/api', ordersRouter);
app.use('/api', cartRouter);

app.listen(3000, async () => {
    await createFirstAdmin(ADMIN_SECRET);
    console.log("server on port 3000");
});