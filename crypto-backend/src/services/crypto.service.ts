import pool from '../config/database';
import { Crypto } from '../models/crypto.model';


export const getCryptos = async (): Promise<Crypto[]> => {
    const result = await pool.query('SELECT * FROM cryptocurrencies');

    return result.rows;
    }

export const getCryptoById = async (id: number): Promise<Crypto | null> => {
    const result = await pool.query('SELECT * FROM cryptocurrencies WHERE crypto_id = $1', [id]);
    return result.rows[0] || null;
    }

export const createCrypto = async (crypto: Crypto): Promise<Crypto> => {
    const result = await pool.query(
        'INSERT INTO cryptocurrencies (name, symbol) VALUES ($1, $2) RETURNING *',
        [crypto.name, crypto.symbol,]
    );
    return result.rows[0];
    }


export const updateCrypto = async (id: number, crypto: Partial<Crypto>): Promise<Crypto | null> => {
    const result = await pool.query(
        'UPDATE cryptocurrencies SET name = $1, symbol = $2 WHERE crypto_id = $3 RETURNING *',
        [crypto.name, crypto.symbol, id]
    );
    return result.rows[0] || null;
    }

export const deleteCrypto = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM cryptocurrencies WHERE crypto_id = $1', [id]);
    }

export const getCryptoByName = async (name: string): Promise<Crypto | null> => {
    const result = await pool.query('SELECT * FROM cryptocurrencies WHERE name = $1', [name]);
    return result.rows[0] || null;
    }
    