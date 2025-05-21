const express = require('express');
const router = express.Router();
const {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getTotalSales,
  getSalesHistory,
  getDailySales,
  getMonthlySales
} = require('../controllers/sales');

router.get('/', getAllSales);
router.get('/total', getTotalSales); // Rota para vendas totais
router.get('/history', getSalesHistory); // Rota para histórico diário
router.get('/daily', getDailySales); // Rota para vendas diárias
router.get('/monthly', getMonthlySales); // Rota para vendas mensais
router.get('/:id', getSaleById);
router.post('/', createSale);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);

module.exports = router;