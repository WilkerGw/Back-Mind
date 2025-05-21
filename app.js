const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const promotionRoutes = require('./routes/promotions');
const boletoRoutes = require('./routes/boletos');
const agendamentoRoutes = require('./routes/agendamento');
const app = express();

// Conectar ao banco de dados
connectDB();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/boletos', boletoRoutes);
app.use('/api/agendamento', agendamentoRoutes);

// Arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));