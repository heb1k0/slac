const mongoose = require('mongoose');
const ConCarrito = mongoose.Schema;
const Bar = require("./bar");

const ConfirmacionSchema = ConCarrito({
  name: {
    type: String,
  },
  lastname:{
    type: String,
  },
  email: {
    type: String,
  },
  phone:{
    type: Number,
  },
  address:{
    type: String,
  },
  num:{
    type: String,
  },
  observaciones:{
    type: String,
  },
  carrito:{
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  enviado: {
    type: Boolean,
    default: false,
  },
  total: {
    type: String,
  },
  euro:{
    type: Number
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
  pagado: {
    type: Boolean,
    default: false,
  },
  recogida: {
    type: Boolean,
    default: false,
  },
  tienda: { type:  ConCarrito.ObjectId, ref: "Bar" },
  stripe: {
    type: String,
  },
  carritoArray: [{
     nombre: String, 
     categoria: String,
     status:{
        type: Boolean,
        default: false,
     }
    }
  ],

},{
  timestamps: true
  });

module.exports = mongoose.model('confirmacion', ConfirmacionSchema);