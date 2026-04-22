const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // ID do usuário
  name: { type: String, required: true } // Nome do usuário
}, { _id: false });

const articleSchema = new mongoose.Schema({
  article: { type: Number, required: true }, // Código do artigo
  name: { type: String, required: true }, // Nome do artigo
  time: { type: Number }, // Tempo da prisão em minutos do artigo
  fine: { type: Number }, // Multa do artigo
  bail: { type: Number }, // Fiança do artigo
  bail_paid: { type: Boolean } // Se a fiança foi paga
}, { _id: false });

const reductionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome da redução
  percentage: { type: Number, required: true } // Porcentagem da redução
}, { _id: false });

const evidenceSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Tipo da evidencia
  url: { type: String, required: true } // Link da evidencia
}, { _id: false });

const schema = new mongoose.Schema({
  status: { type: String, required: true, default: 'pending' }, // Status do registro da prisão
  officers_prison: [ userSchema ], // Oficiais responsáveis pelo registro da prisão
  officers_conduction: [ userSchema ], // Oficiais responsáveis pela condução
  attorney: { // Identificação do advogado
    id: { type: Number },
    name: { type: String },
    exemption: { type: Number }
  },
  prisoner: { // Identificação do preso
    id: { type: Number, required: true },
    name: { type: String, required: true }
  },
  articles: [ articleSchema ], // Artigos da prisão
  months: { type: Number, required: true }, // Tempo total da pena
  fine: { type: Number, required: true }, // Multa total
  reduction: [ reductionSchema ], // Reduções aplicadas
  evidences: [ evidenceSchema ] // Evidencias anexadas
}, { timestamps: true });

module.exports = mongoose.model('Prison', schema);