const Sale = require('../models/Sale');
const Client = require('../models/Client');
const Product = require('../models/Product');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('client', 'fullName')
      .populate('products.product', 'name price');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('client', 'fullName')
      .populate('products.product', 'name price');
    if (!sale) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { client, products, seller, paymentMethod, total } = req.body;
    if (!client || !products || !seller || !paymentMethod || total == null) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
    }
    const validClient = await Client.findById(client);
    if (!validClient) {
      return res.status(400).json({ error: 'Cliente não encontrado.' });
    }
    const invalidProduct = await Promise.any(
      products.map(async (p) => !(await Product.findById(p.product)))
    ).catch(() => null);
    if (invalidProduct) {
      return res.status(400).json({ error: 'Um ou mais produtos inválidos.' });
    }
    if (total < 0) {
      return res.status(400).json({ error: 'Total não pode ser negativo.' });
    }
    const saleData = {
      client,
      products: products.map(p => ({
        product: p.product,
        quantity: p.quantity
      })),
      seller,
      paymentMethod,
      total
    };
    const sale = new Sale(saleData);
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('client', 'fullName')
      .populate('products.product', 'name price');
    if (!sale) return res.status(404).json({ error: 'Venda não encontrada.' });
    res.json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Venda não encontrada.' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalSales = async (req, res) => {
  try {
    const total = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    res.json({ total: total[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          total: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const formattedData = sales.map((item) => ({
      day: item._id,
      sales: item.total
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};