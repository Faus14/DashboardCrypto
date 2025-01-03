import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import cryptoRoutes from './routes/crypto.routes';
import portfolioRoutes from './routes/portfolio.routes';
import loginRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/users', userRoutes);
app.use('/cryptos', cryptoRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/transaction', transactionRoutes);
app.use('/login', loginRoutes);

const createAdminUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/users', {
      username: 'admin',
      password: 'admin',
      role: 'Admin',
    });

    console.log('Usuario admin creado con éxito:', response.data);
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
  }
};

createAdminUser();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
