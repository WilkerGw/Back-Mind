const express = require('express');
const router = express.Router();
const {
  getAllBoletos,
  getBoletoById,
  createBoleto,
  updateBoleto,
  deleteBoleto
} = require('../controllers/boletos');

router.get('/', getAllBoletos);
router.get('/:id', getBoletoById);
router.post('/', createBoleto);
router.put('/:id', updateBoleto);
router.delete('/:id', deleteBoleto);

// Adicione funcionalidades agregadas como no Sales (opcional)
router.get('/total', async (req, res) => {
  try {
    const total = await Boleto.aggregate([
      { $group: { _id: null, total: { $sum: "$parcelValue" } } }
    ]);
    res.json({ total: total[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;