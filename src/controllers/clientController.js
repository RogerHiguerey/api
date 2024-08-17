import Client from '../models/Client.js';
import Shipment from '../models/Shipment.js';
import { generateToken } from '../utils/jwt.js';

export const registerClient = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const client = await Client.create({ 
      name, 
      email, 
      password, 
      phone, 
      status: 'active' // Establecer el estado por defecto como 'active'
    });
    const token = generateToken(client);
    res.status(201).json({ 
      client: { 
        id: client.id, 
        name: client.name, 
        email: client.email,
        status: client.status // Incluir el estado en la respuesta
      }, 
      token 
    });
  } catch (error) {
    next(error);
  }
};

export const loginClient = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ where: { email } });
    
    if (!client || !(await client.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(client);

    res.json({ client: { id: client.id, name: client.name, email: client.email }, token });
  } catch (error) {
    next(error);
  }
};

export const getClients = async (req, res, next) => {
  try {
    const clients = await Client.findAll({ attributes: { exclude: ['password'] } });
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await client.update({ name, email, phone });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await client.destroy();
    console.log("Cliente : ", client.name , "Eliminado con exito" );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getClientShipments = async (req, res, next) => {
  try {
    console.log('Client:', req.client);  // Añadir este log para verificar el cliente
    const clientId = req.client.id;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is missing' });
    }

    const shipments = await Shipment.findAll({
      where: { ClientId: clientId }
    });

    res.json(shipments);
  } catch (error) {
    next(error);
  }
};
