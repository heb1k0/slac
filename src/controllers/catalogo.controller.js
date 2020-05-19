const catalogoCntrl = {};
const Task = require("../models/task");
const Carrito = require("../models/carrito");
const Confirmacion = require("../models/confirmacion");
const datalyse = require("../models/datalyse");
const Estado = require("../models/status");
const Bar = require("../models/bar");
const Categoria = require("../models/categorias");
const Users = require("../models/users");
var lodash = require('lodash');

catalogoCntrl.home = async (req, res) => {


    /*const id = req.sessionID;
    const estado = await Estado.findOne();
    const tasksHome = await Task.find();
    const carrito = await Carrito.find({ 'owner': id, 'status': false})
    const tapas = tasksHome.filter(categori => categori.categoria == 'TAPAS');
    const bocadillos = tasksHome.filter(categori => categori.categoria == 'BOCADILLOS');
    const platos = tasksHome.filter(categori => categori.categoria == 'PLATOS COMBINADOS');
    const bebidas = tasksHome.filter(categori => categori.categoria == 'BEBIDAS');
    const otros = tasksHome.filter(categori => categori.categoria == 'OTROS');
    res.render('catalogo', {
      tasksHome,
      tapas,
      bocadillos,
      platos,
      bebidas,
      otros,
      carrito,
      sessionID: id,
      estado
    });*/
}

catalogoCntrl.bares = async (req, res) =>{

  try{

    let tienda = await Bar.findOne({slug:req.params.slug})
    let id = tienda.id 
    let estado = await Estado.findOne({'tienda':id});
    let idSe = req.sessionID;
    let carrito = await Carrito.find({ 'owner': idSe, 'status': false})
    var categorias = await Categoria.find().sort('position')
    await Task.find({}, function(err, task) {
      Categoria.populate(task, {path: "categoria"},function(err, task){
        var tasksHome = lodash.groupBy(task, 'categoria.name')
        console.log(tasksHome)
        res.render('catalogo', {
          categorias,
          tasksHome,
          carrito,
          slug:req.params.slug,
          sessionID: idSe,
          estado,
          tienda
        });
      }); 
    });
  
    }catch(e){
  
      res.send("error")
      
  
  
    }
  
}

catalogoCntrl.add =  async (req, res) => {
    let id = req.params.id;
    let task = await Task.findById(id);
    let carrito = await new Carrito({nombre:task.nombre,precio:task.precio,owner:req.body.owner,categoria:task.categoria,tienda:task.tienda});
    await carrito.save().then(ok  =>{
      res.send(carrito.id);
    }).catch(err =>{
      console.log("carErr");
    });
}

catalogoCntrl.delete = async (req, res) => {
    let { id } = req.body;
    await Carrito.deleteOne({_id:id}).then(ok  =>{
        res.send(true);
    }).catch(err =>{
        console.log(err);
        res.send(false)
    });
  
}

catalogoCntrl.confirmar =  async (req, res)=>{

   let stripe = require('stripe')('xxxxx');

    let tienda = await Bar.findOne({slug:req.params.slug})
    let id = req.params.id;

    console.log(tienda);
    let carrito = await Carrito.find({ 'owner': id, 'status': false})

    if(carrito.length >0){
  
        res.render('confirmar',{
          tienda,
          carrito,
          slug:req.params.slug,
          sessionID: id
        });
  
    }else{
  
      res.redirect('/');
  
    }

    /*await Carrito.find({ 'owner': id, 'status': false}, function(err, carrito) {
      Bar.populate(carrito, {path: "tienda"},function(err, cesta){

        console.log(carrito)
          if(cesta){

            res.render('confirmar',{
              carrito,
              sessionID: id
            });


          }else{


            res.redirect('/');


          }
      }); */
}


catalogoCntrl.confirm =  async (req, res)=>{


    let tienda = await Bar.findOne({slug:req.params.slug})
  // Funcion cambiar status carrito 
          
          async function change(id){
              var test = [];
              var carrito = await Carrito.find({ 'owner' : id })
              for(var i=0; i < carrito.length; i++){
                var idcar = carrito[i]._id;
                var count = test.push({nombre:carrito[i].nombre,id:idcar,categoria:carrito[i].categoria});
                await Carrito.update({_id: idcar}, {status: true}).then(ok =>{
                }).catch(err =>{
                  return false;
                });
               
              }
               return test;
          }

  //


  // Funcion calcular precio 

        async function totalPrecio(id){
          var precio = 0;
          var carrito = await Carrito.find({ 'owner' : id })
          for(var i=0; i < carrito.length; i++){
            var id = carrito[i]._id
            var sumar = carrito[i].precio;
            var precio = parseFloat(precio + sumar);
            var precio2 = precio.toFixed(2); 
          } 
          return precio2;
        }


        async function confirmCarge(req,price,euro,id){

          /*console.log(req)*/

          var msj = req
          msj.total = price
          msj.euro = euro
          msj.pagado = "true"
          msj.recogida = req.envio
          msj.tienda = id
          msj.stripe = req.stripeToken
           /* console.log(confirm);*/
          var result2 = await change(req.id); 
          msj.carritoArray = result2
          console.log(msj)
          let confirm = await new Confirmacion(msj)
          confirm.carrito = req.id
           await confirm.save()
          console.log(result2);

          res.redirect('/'+tienda.slug+'/seguimiento/'+confirm._id+'');


        }
    
    //

    var total =  await totalPrecio(req.params.id);
    let stripe = require('stripe')('sk_test_6qF8oFE8WYQx9ODwKe2ngsWc');

    var euro = total.toString();
    var price = euro.replace(/\./g,'');
  
    // Comprobamos toquen 

    if(!req.body.stripeToken == ""){


            stripe.charges.create({
            amount: price,
            currency: "eur",
            source: "tok_mastercard", // obtained with Stripe.js
            description: tienda.id,
            metadata: {
              ID: req.body.id,
              Nombre: req.body.name,
              Phone: req.body.phone
            }
            }, function(err, charge) {
              /*console.log(err)
              console.log(charge)*/
              if(err){

                res.redirect('/confirmar/'+req.params.id+'');
                console.log(err);

              }

              if(charge){
                

                try {

                  confirmCarge(req.body,price,euro,tienda.id);
                  req.session.destroy();

                 

                }catch (e) {
          
                  res.redirect('/confirmar/'+req.params.id+'');
                  console.log(e);
                  
                }

                
              }


            });
    }else{
      console.log(req.body.stripeToken);
    }


  /*const confirm = await new Confirmacion(req.body).then(ok  =>{
    console.log(ok);
  }).catch(err =>{
    console.log(err);

  });*/
  //const task = await Task.findById(id);
  //const carrito = await new Carrito({nombre:task.nombre,precio:task.precio,owner:req.body.owner});*/

}
module.exports = catalogoCntrl;