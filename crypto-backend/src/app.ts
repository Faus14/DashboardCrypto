import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import cryptoRoutes from './routes/crypto.routes';
import portfolioRoutes from './routes/portfolio.routes';
import loginRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import axios from 'axios';
import { createAdminIfNotExists } from './controllers/user.controller';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/users', userRoutes);
app.use('/cryptos', cryptoRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/transaction', transactionRoutes);
app.use('/login', loginRoutes);

createAdminIfNotExists();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
