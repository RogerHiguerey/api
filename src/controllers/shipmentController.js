import Shipment from '../models/Shipment.js';
import Client from '../models/Client.js';

export const createShipment = async (req, res, next) => {
  try {
    const { clientId, trackingNumber, type, origin, destination, estimatedDeliveryDate, note } = req.body;
    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const shipment = await Shipment.create({
      ClientId: clientId,
      trackingNumber,
      type,
      origin,
      destination,
      estimatedDeliveryDate,
      statusHistory: [{ status: 'pending', date: new Date(), note }]
    });

    res.status(201).json(shipment);
  } catch (error) {
    next(error);
  }
};


export const getShipments = async (req, res, next) => {
  try {
    const clientId = req.user.role === 'client' ? req.user.id : req.query.clientId;
    const shipments = await Shipment.findAll({ 
      where: clientId ? { ClientId: clientId } : {},
      include: Client 
    });
    res.json(shipments);
  } catch (error) {
    next(error);
  }
};

export const getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, { include: Client });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (req.user.role === 'client' && shipment.ClientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

export const updateShipment = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const shipment = await Shipment.findByPk(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Crear un nuevo objeto de historial
    if (status && status !== shipment.status) {
      const newStatusEntry = {
        status,
        date: new Date(),
        note: note || '',
      };
      
      // Agregar el nuevo objeto de historial al array existente
      const updatedStatusHistory = [...shipment.statusHistory, newStatusEntry];

      // Actualizar el estado y el historial de estados
      shipment.status = status;
      shipment.statusHistory = updatedStatusHistory;
    }

    await shipment.save();
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};


export const deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    await shipment.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
