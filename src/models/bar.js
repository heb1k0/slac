const mongoose = require('mongoose');
const SchemaBares = mongoose.Schema;
const user = require("./users");
const barSchema = SchemaBares({
  name: {
    type: String,
    required: true
  },
  slug:{
    type: String,
  },
  owner: { type: SchemaBares.ObjectId, ref: "user" },
  status: {
    type: Boolean,
    default: false
  },
  logo: {
    type: String
  },
  calle:{
    type: String,
    required: true
  },
  muni:{
    type: String,
    required: true
  },
  cp:{
    type: Number,
    required: true
  },
  phone:{
    type:Number,
    required: true
  },
  min:{
    type: Number,
    required: true
  },
  envio:{
    type: Number,
    required: true
  },
  desc:{
    type: String,
    required: true
  },
  mapa:{
    type: String
  },
  phone:{
    type:String,
    required: true
  }
})

module.exports = mongoose.model('bar', barSchema);