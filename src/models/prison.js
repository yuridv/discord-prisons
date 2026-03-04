const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  status: { type: String, required: true, default: 'pending' }, // Status do registro da prisão
  offices_prison: [ userSchema ], // Oficiais responsáveis pelo registro da prisão
  offices_primary: [ userSchema ], // Oficiais responsáveis pela prisão
  attorney: { // Identificação do Advogado
    id: { type: Number },
    name: { type: String }
  },
  prisoner: { // Identificação do Preso
    id: { type: Number, required: true },
    name: { type: String, required: true }
  },
  articles: [ articleSchema ], // Artigos da prisão
  months: { type: Number, required: true }, // Tempo total da pena
  fine: { type: Number, required: true }, // Multa total
  reduction: [ reductionSchema ] // Reduções aplicadas
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // ID do Usuario
  name: { type: String, required: true } // Nome do Usuario
}, { _id: false });

const articleSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Codigo do Artigo
  name: { type: String, required: true }, // Nome do Artigo
  months: { type: Number }, // Quantidade de meses penitenciários do Artigo
  fine: { type: Number }, // Multa do Artigo
  bail: { type: Number }, // Fiança do Artigo
  bail_paid: { type: Boolean } // Se a fiança foi paga
}, { _id: false });

const reductionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome da Redução
  percentage: { type: Number, required: true } // Porcentagem da Redução
}, { _id: false });


module.exports = mongoose.model('Prison', schema);