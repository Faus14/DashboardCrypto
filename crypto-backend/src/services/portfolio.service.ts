import { Pool } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';
import pool from '../config/database';
import e from 'express';


export const createPortfolioCrypto = async (portfolio_id: number, crypto_id: number, quantity: number) => {
  try {
    const result = await pool.query(
      'INSERT INTO portfolio_cryptos (portfolio_id, crypto_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [portfolio_id, crypto_id, quantity]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error al crear la relación de criptomoneda en el portafolio:', err);
    throw err;
  }
};


export const getPortfolioByUserId = async (user_id: number) => {
  try {

    const result = await pool.query(
      `SELECT p.portfolio_id, p.portfolio_name, c.symbol, pc.quantity
      FROM portfolios p
      JOIN portfolio_cryptos pc ON p.portfolio_id = pc.portfolio_id
      JOIN cryptocurrencies c ON pc.crypto_id = c.crypto_id
      WHERE p.user_id = $1`,
      [user_id]
    );


    const portfolios = result.rows.reduce((acc: any[], row: any) => {
      const { portfolio_id, portfolio_name, symbol, quantity } = row;
      let portfolio = acc.find(p => p.portfolio_id === portfolio_id);
      if (!portfolio) {
        portfolio = {
          portfolio_id,
          portfolio_name,
          cryptos: []
        };
        acc.push(portfolio);
      }
      portfolio.cryptos.push({ symbol, quantity });
      return acc;
    }, []);

    return portfolios;
  } catch (err) {
    console.error('Error al obtener el portafolio:', err);
    throw err;
  }
};


export const getPortfolioBalance = async (user_id: number) => {
  try {

    const portfolios = await getPortfolioByUserId(user_id);
    let totalBalance = 0;


    for (const portfolio of portfolios) {
      for (const crypto of portfolio.cryptos) {
        try {

          const response = await axios.get(`https://criptoya.com/api/${crypto.symbol}/USD/1`);
          const askPrice = response.data.satoshitango?.ask;

          if (!askPrice) {
            console.warn(`No se encontró precio para ${crypto.symbol}`);
            continue;
          }

          totalBalance += crypto.quantity * askPrice;
        } catch (apiError) {
          if (axios.isAxiosError(apiError)) {
            console.error(`Error al obtener datos de CriptoYa para ${crypto.symbol}: ${apiError.message}`);
          } else {
            console.error(`Error al obtener datos de CriptoYa para ${crypto.symbol}:`, apiError);
          }
        }
      }
    }

    return totalBalance;
  } catch (err) {
    console.error('Error al calcular el balance del portafolio:', err);
    throw err;
  }
};


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



export const deletePortfolioCrypto = async (portfolio_id: number, crypto_id: number) => {
  try {

    const result = await pool.query(
      'SELECT * FROM portfolio_cryptos WHERE portfolio_id = $1 AND crypto_id = $2',
      [portfolio_id, crypto_id]
    );

    if (result.rowCount === 0) {
      throw new Error('No se encontró la criptomoneda en el portafolio');
    }

    await pool.query(
      'DELETE FROM portfolio_cryptos WHERE portfolio_id = $1 AND crypto_id = $2',
      [portfolio_id, crypto_id]
    );
  } catch (err) {
    console.error('Error al eliminar la relación entre el portafolio y la criptomoneda:', err);
    throw err;
  }
};
