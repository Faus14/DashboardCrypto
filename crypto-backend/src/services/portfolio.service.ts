import { Pool } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';
import pool from '../config/database';
import e from 'express';


export const createPortfolios = async (user_id: number, portfolio_name: string) => {
  try {
    const result = await pool.query(
      'INSERT INTO portfolios (user_id, portfolio_name) VALUES ($1, $2) RETURNING *',
      [user_id, portfolio_name]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error al crear el portafolio:', err);
    throw err;
  }
};

export const deletePortfolios = async (portfolio_id: number) => {
  try {
    await pool.query('DELETE FROM portfolios WHERE portfolio_id = $1', [portfolio_id]);
  } catch (err) {
    console.error('Error al eliminar el portafolio:', err);
    throw err;
  }
};

export const getPortfolios = async (user_id: number) => {
  try {
    const result = await pool.query('SELECT * FROM portfolios WHERE user_id = $1', [user_id]);
    return result.rows;
  } catch (err) {
    console.error('Error al obtener los portafolios:', err);
    throw err;
  }
};

export const getPortfolioByIdService = async (portfolio_id: number) => {
  try {
    const result = await pool.query('SELECT * FROM portfolios WHERE portfolio_id = $1', [portfolio_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error al obtener el portafolio:', err);
    throw err;
  }
}

export const getTotalBalance = async (portfolio_id: number) => {
  try {
    const result = await pool.query(
      `SELECT c.symbol, SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity
                                 WHEN t.transaction_type = 'remove' THEN -t.quantity
                                 ELSE 0 END) AS total_quantity
      FROM transactions t
      JOIN cryptocurrencies c ON t.crypto_id = c.crypto_id
      WHERE t.portfolio_id = $1
      GROUP BY c.symbol`,
      [portfolio_id]
    );

    const cryptos = result.rows;
    let totalBalance = 0;

    for (const crypto of cryptos) {
      try {
        const response = await axios.get(`https://criptoya.com/api/${crypto.symbol}/ARS/1`);
        const askPrice = response.data.satoshitango?.ask;

        if (!askPrice) {
          console.warn(`No se encontró precio para ${crypto.symbol}`);
          continue;
        }

        totalBalance += crypto.total_quantity * askPrice;
      } catch (apiError) {
        if (axios.isAxiosError(apiError)) {
          console.error(`Error al obtener datos de CriptoYa para ${crypto.symbol}: ${apiError.message}`);
        } else {
          console.error(`Error al obtener datos de CriptoYa para ${crypto.symbol}:`, apiError);
        }
      }
    }

    return totalBalance;
  } catch (err) {
    console.error('Error al obtener el balance total del portafolio:', err);
    throw err;
  }
};


