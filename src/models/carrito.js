const mongoose = require('mongoose');
const SchemaCarrito = mongoose.Schema;
const Bar = require("./bar");

const CarritoSchema = SchemaCarrito({
  nombre: {
    type: String,
  },
  precio:{
    type: Number,
  },
  owner: {
    type: String
  },
  categoria:{
    type:String
  },
  status: {
    type: Boolean,
    default: false
  },
  tienda: { type: SchemaCarrito.ObjectId, ref: "Bar" } 
},{
  timestamps: true
  });

module.exports = mongoose.model('carrito', CarritoSchema);