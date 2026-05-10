const { Trip, Stop, Activity, Budget, ChecklistItem, TripNote, User } = require('../models');

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: Stop, as: 'stops', include: [{ model: Activity, as: 'activities' }] },
        { model: Budget, as: 'budget' },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, trips });
  } catch (error) { next(error); }
};

const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        { model: Stop, as: 'stops', include: [{ model: Activity, as: 'activities' }], order: [['order_index', 'ASC']] },
        { model: Budget, as: 'budget' },
        { model: ChecklistItem, as: 'checklist_items' },
        { model: TripNote, as: 'notes', order: [['created_at', 'DESC']] },
      ],
    });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, trip });
  } catch (error) { next(error); }
};

const createTrip = async (req, res, next) => {
  try {
    const { title, description, start_date, end_date, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const cover_image = req.file ? `/uploads/${req.file.filename}` : null;
    const trip = await Trip.create({ user_id: req.user.id, title, description, start_date, end_date, cover_image, status });
    res.status(201).json({ success: true, trip });
  } catch (error) { next(error); }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    const { title, description, start_date, end_date, status, is_public } = req.body;
    const cover_image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const updateData = { title, description, start_date, end_date, status };
    if (is_public !== undefined) updateData.is_public = is_public;
    if (cover_image) updateData.cover_image = cover_image;
    await trip.update(updateData);
    res.json({ success: true, trip });
  } catch (error) { next(error); }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    await trip.destroy();
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) { next(error); }
};

const getPublicTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, is_public: true },
      include: [
        { model: User, as: 'user', attributes: ['name', 'profile_photo'] },
        { model: Stop, as: 'stops', include: [{ model: Activity, as: 'activities' }], order: [['order_index', 'ASC']] },
        { model: Budget, as: 'budget' },
      ],
    });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found or not public' });
    res.json({ success: true, trip });
  } catch (error) { next(error); }
};

module.exports = { getTrips, getTrip, createTrip, updateTrip, deleteTrip, getPublicTrip };
