const follow = {};
const Task = require("../models/task");
const Carrito = require("../models/carrito");
const Confirmacion = require("../models/confirmacion");
const Bar = require("../models/bar");

follow.home =  async (req,res)=>{

    let tienda = await Bar.findOne({slug:req.params.slug})

    var { id } = req.params;

    try {

    let car = await Confirmacion.findById(id);
    let idOwner = car.carrito;
    let carrito = await Carrito.find({'owner': idOwner});
    
      res.render('seguimiento',{
        car,
        tienda,
        carrito
      });

    } catch (e) {

      res.redirect('/');
      
    }
}

follow.pago = async (req,res)=>{

    let stripe = require('stripe')('sk_test_ThAYgebx4JpHO2JJTaJMrbLN');
  
    let id = req.body.id

    
  
    let car = await Confirmacion.findById(id);
    console.log(car.total);
    var euro = car.total.toString();
    var price = euro.replace(/\./g,'');
  
    try{ 
      
      stripe.charges.create({
      amount: price,
      currency: "eur",
      source: "tok_mastercard", // obtained with Stripe.js
      description: "ID:"+car._id+" Nombre: "+car.name+" Phone:"+car.phone+""
      }, function(err, charge) {
        /*console.log(err)
        console.log(charge)*/
      });
  
      let task = await Confirmacion.findById(id);
      task.pagado = !task.pagado;
      let carrito =  await task.save();
  
      res.redirect('/seguimiento/'+id+'');
  
    }catch (e) {
  
      res.redirect('/');
      
    }
  
}




module.exports = follow;