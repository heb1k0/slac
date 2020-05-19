const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bar = require("./bar");
const categorias = require("./categorias");

const TaskSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio:{
    type: String,
    required: true,
  },
  categoria:{
    type: Schema.ObjectId,
    ref: categorias
  },
  urlImg: {
    type: String
  },
  owner: {
    type: String
  },
  tienda:{
    type: Schema.ObjectId,
    ref: Bar 
  }
},{
  timestamps: true
  });

module.exports = mongoose.model('tasks', TaskSchema);