// auth.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';
import Client from '../models/Client.js';

const extractToken = (req) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  return authHeader.replace('Bearer ', '');
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const findEntity = async (model, id) => {
  const entity = await model.findOne({ where: { id } });

  if (!entity) {
    throw new Error('Entity not found');
  }

  return entity;
};

const authenticateEntity = (model, entityName) => {
  return async (req, res, next) => {
    try {
      const token = extractToken(req);
      const decoded = verifyToken(token);
      const entity = await findEntity(model, decoded.id);
     
      req.token = token;
      req[entityName] = entity;  // Asigna a req.user o req.client según el tipo de entidad
      next();
    } catch (error) {
      res.status(401).send({ error: `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} authentication required.` });
    }
  };
};

export const authenticate       = authenticateEntity(User,    'user');
export const authenticateClient = authenticateEntity(Client,  'client');

export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const role = req.user?.role || req.client?.role;

    if (roles.length && (!role || !roles.includes(role))) {
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions.' });
    }
    next();
  };
};
