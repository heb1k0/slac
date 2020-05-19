const mongoose = require('mongoose');
const SchemaUsers = mongoose.Schema;
const Bar = require("./bar");
const bcrypt = require('bcrypt');

const userSchema = SchemaUsers({
  name: {
    type: String,
  },
  email:{
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  tienda: { 
    type: SchemaUsers.ObjectId, 
    ref: "Bar"
  },
  phone:{
    type:String
  },
  status: {
    type: Boolean,
    default: false
  },
})

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);