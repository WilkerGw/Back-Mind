const Promotion = require('../models/Promotion');

exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('products');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate('products');
    if (!promotion) return res.status(404).json({ error: 'Promoção não encontrada' });
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPromotion = async (req, res) => {
  const promotion = new Promotion(req.body);
  try {
    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('products');
    if (!promotion) return res.status(404).json({ error: 'Promoção não encontrada' });
    res.json(promotion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) return res.status(404).json({ error: 'Promoção não encontrada' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};