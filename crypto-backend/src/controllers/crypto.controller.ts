import { Request, Response } from 'express';
import * as cryptoService from '../services/crypto.service';

export const getCryptos = async (req: Request, res: Response): Promise<void> => {
  try {
    const cryptos = await cryptoService.getCryptos();
    res.status(200).json(cryptos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cryptos' });
  }
  
};

export const getCryptoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const crypto = await cryptoService.getCryptoById(Number(req.params.id));
    if (!crypto) {
      res.status(404).json({ message: 'Crypto no encontrado' });
      return;
    }
    res.status(200).json(crypto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener crypto' });
  }
} 


export const createCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const crypto = await cryptoService.createCrypto(req.body);
    res.status(201).json(crypto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear crypto' });
  }
}

export const updateCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const crypto = await cryptoService.updateCrypto(Number(req.params.id), req.body);
    if (!crypto) {
      res.status(404).json({ message: 'Crypto no encontrado' });
      return;
    }
    res.status(200).json(crypto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar crypto' });
  }
}

export const deleteCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    await cryptoService.deleteCrypto(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar crypto' });
  }
}