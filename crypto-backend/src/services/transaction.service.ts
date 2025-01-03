import pool from '../config/database';
import { Transaction } from '../models/transaction.model';
import axios from 'axios';

export const getporfolioTransactions = async (portfolio_id: number): Promise<Transaction[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM transactions
    WHERE portfolio_id = $1
    `,
    [portfolio_id]
  );
  return result.rows;
}

export const getPortfolioCryptos = async (portfolio_id: number): Promise<any[]> => {
  const result = await pool.query(
    `
    SELECT 
      t.crypto_id,
      c.name AS crypto_name,
      SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity::numeric ELSE 0 END) -
      SUM(CASE WHEN t.transaction_type = 'remove' THEN t.quantity::numeric ELSE 0 END) AS total_quantity
    FROM transactions t
    JOIN cryptocurrencies c ON t.crypto_id = c.crypto_id
    WHERE t.portfolio_id = $1
    GROUP BY t.crypto_id, c.name
    HAVING SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity::numeric ELSE 0 END) -
           SUM(CASE WHEN t.transaction_type = 'remove' THEN t.quantity::numeric ELSE 0 END) > 0
    `,
    [portfolio_id]
  );
  return result.rows;
};


export const addCryptoToPortfolio = async (transaction: Transaction): Promise<Transaction> => {
  const { portfolio_id, crypto_id, quantity, transaction_type, transaction_date } = transaction;

  const result = await pool.query(
    `
    INSERT INTO transactions (portfolio_id, crypto_id, quantity, transaction_type, transaction_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [portfolio_id, crypto_id, quantity, transaction_type, transaction_date]
  );
  return result.rows[0];
};

// Quitar criptomoneda de un portafolio (VENDER)
export const removeCryptoFromPortfolio = async (
  portfolio_id: number,
  crypto_id: number,
  quantity: number
): Promise<any> => {
  try {
    // Verificar la cantidad disponible en la base de datos
    const result = await pool.query(
      `
      SELECT 
        SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity::numeric ELSE 0 END) -
        SUM(CASE WHEN t.transaction_type = 'remove' THEN t.quantity::numeric ELSE 0 END) AS total_quantity
      FROM transactions t
      WHERE t.portfolio_id = $1 AND t.crypto_id = $2
      `,
      [portfolio_id, crypto_id]
    );

    const currentQuantity = result.rows[0]?.total_quantity || 0;

    console.log(`Cantidad disponible para vender: ${currentQuantity}`);
    console.log(`Cantidad solicitada para vender: ${quantity}`);

    // Validar si hay suficiente cantidad para la venta
    if (currentQuantity < quantity) {
      return {
        error: true,
        message: 'Cantidad insuficiente para vender',
        available_quantity: currentQuantity,
      };
    }

    // Registrar transacción de venta
    await pool.query(
      `
      INSERT INTO transactions (portfolio_id, crypto_id, quantity, transaction_type, transaction_date)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [portfolio_id, crypto_id, quantity, 'remove', new Date()]
    );

    return { message: 'Transacción completada', portfolio_id, crypto_id, quantity_vendida: quantity };

  } catch (error) {
    console.error('Error al procesar la transacción:', error);
    throw new Error('Error en la operación de venta');
  }
};

// Obtener el balance total del portafolio para un usuario
export const getPortfolioBalance = async (user_id: number): Promise<number> => {
  const portfoliosResult = await pool.query(
    `
    SELECT p.id AS portfolio_id, t.crypto_id, SUM(t.quantity) AS total_quantity
    FROM portfolios p
    JOIN transactions t ON p.id = t.portfolio_id
    WHERE p.user_id = $1
    GROUP BY p.id, t.crypto_id
    `,
    [user_id]
  );

  const portfolios = portfoliosResult.rows;

  let totalBalance = 0;

  for (const portfolio of portfolios) {
    const { crypto_id, total_quantity } = portfolio;

    try {
      const response = await axios.get(`https://criptoya.com/api/${crypto_id}/ARS/1`);
      const askPrice = response.data.satoshitango?.ask;

      if (!askPrice) {
        console.warn(`No se encontró precio para ${crypto_id}`);
        continue;
      }

      totalBalance += total_quantity * askPrice;
    } catch (apiError) {
      if (axios.isAxiosError(apiError)) {
        console.error(`Error al obtener datos de CriptoYa para ${crypto_id}: ${apiError.message}`);
      } else {
        console.error(`Error al obtener datos de CriptoYa para ${crypto_id}:`, apiError);
      }
    }
  }

  return totalBalance;
};
