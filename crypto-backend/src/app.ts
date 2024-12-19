import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import cryptoRoutes from './routes/crypto.routes';
import portfolioRoutes from './routes/portfolio.routes';
import loginRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/users', userRoutes);
app.use('/cryptos', cryptoRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/login', loginRoutes);


// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
