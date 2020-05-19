const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
var uniqid = require('uniqid');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:path.join(__dirname ,'../assets/img/carta'),
    filename: (req ,file ,cb) =>{
      cb(null, uniqid() + file.originalname)
    }
  })

multer({
    storage,
    dest: path.join(__dirname ,'../assets/img/carta')
  
}).single('image');

module.exports = multer;
