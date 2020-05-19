const admin = {}
const Task = require('../models/task');
const Confirmacion = require('../models/confirmacion');
const Estado = require('../models/status');
const fs = require('fs');
const Users = require('../models/users');
const Bar = require('../models/bar');
const bcrypt = require('bcrypt');
const datalyse = require('../models/datalyse');
const Categoria = require('../models/categorias');
const { Image } = require('image-js');


admin.createuser = async (req,res,next) =>{

  let BCRYPT_SALT_ROUNDS = 12;

  bcrypt.hash(req.params.password, BCRYPT_SALT_ROUNDS)
    .then(function(hashedPassword) {
        console.log(hashedPassword);
        let user = new Users(req.params);
        user.password = hashedPassword
        user.save();
        res.send(user)
        
    }).catch(e =>{
      console.log(e);
    })


}

admin.creater = async (req,res,next) =>{


        let nbar = await new Bar(req.params);
        let slug = string_to_slug(req.params.name)
        nbar.slug = slug
        let savebar = await nbar.save()
        let estado = new Estado({tienda:nbar._id})
        estado.save();
        res.send(savebar)

}



admin.AuthOk = (req,res,next) =>{

  if(req.isAuthenticated()) return next();
  
  res.redirect("/back/login");

}

admin.logout = (req,res)=>{
  req.session.destroy();
  res.redirect("/login");
}

admin.login = (req, res) => {

  res.render('login');


}

admin.loginpost = (req, res) => {

  res.send(req.body);


}

admin.cerrarpedidos = async (req, res) => {

  let estadotienda = await Estado.findOne({'tienda':req.session.owner});
  estadotienda.status = !estadotienda.status;
  let cchange =  await estadotienda.save();
  res.redirect('/back/admin/');


}

admin.visto = async (req, res) => {

  let cambiarestado = await Confirmacion.findById(req.body.id);
  cambiarestado.confirmado = !cambiarestado.confirmado;
  let cchange =  await cambiarestado.save().then(ok =>{
           
    res.send(true);
           
  })

}

admin.pendientes = async (req, res) => {

    let bar = await Bar.findById(req.session.owner)
    let estado = await Estado.findOne({'tienda':req.session.owner});
    let pedidos = await Confirmacion.find({'enviado': false , 'tienda': req.session.owner});
    let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
    
    let novistos = await pedidos.filter(novistos => novistos.confirmado == false);
    res.render('admin/pendientes',{
      pedidos,
      bar,
      pendientes,
      novistos,
      estado
    });
}

admin.pendientesCarrito = async (req, res) => {

    let pedidos = await Confirmacion.findOneAndUpdate({
      _id: req.body.id,
      'carritoArray._id': req.body.idc
    },
    {
      $set: {
        'carritoArray.$.status': req.body.value
      }
    },
    null,
    (err) => {
      if (err) {
        res.send(false)
      } else {
        res.send(true)
      }
    }
  )

}


admin.home = async (req, res) => {

  let estado = await Estado.findOne({'tienda':req.session.owner});
  let pedidos = await Confirmacion.find({'tienda': req.session.owner});
  let pedidosnovistos = await  pedidos.filter(novistos => novistos.enviado == false);
  let novistos = await pedidosnovistos.filter(novistos => novistos.confirmado == false);
  let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
  let completados = pedidos.filter(completados => completados.enviado == true);
  let bar = await Bar.findById(req.session.owner)
  res.render('admin/index',{
    pendientes,
    novistos,
    completados,
    estado,
    bar,
    pedidos
  });
}
admin.completados =  async (req, res) => {

  let pedidoss = await Confirmacion.find({'tienda': req.session.owner});
  let estado = await Estado.findOne({tienda:req.session.owner})
  let pendientes = pedidoss.filter(pendientes => pendientes.enviado == false);
  let pedidos = await pedidoss.filter(pedidos => pedidos.enviado == true);
  let novistos = await pedidoss.filter(novistos => novistos.confirmado == false);
  let bar = await Bar.findById(req.session.owner)
    res.render('admin/completados',{
      pedidos,
      bar,
      pendientes,
      novistos,
      estado
    });
  
}

admin.status =  async (req, res) => {

  let pedidos = await Confirmacion.find({'enviado': true});
  let estado = await Estado.findOne()
    res.render('admin/completados',{
      pedidos,
      estado
    });
}

admin.catalogo = async (req, res)=>{
  let estado = await Estado.findOne({tienda:req.session.owner})
  let pedidos = await Confirmacion.find({'tienda': req.session.owner});
  let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
  let novistos = await pedidos.filter(novistos => novistos.confirmado == false);
  let bar = await Bar.findById(req.session.owner)
    await Task.find({tienda:req.session.owner}, function(err, task) {
      Categoria.populate(task, {path: "categoria"},function(err, task){
        res.render('admin/edit-lista', {
          novistos,
          task,
          estado,
          bar,
          pendientes,
          errorForm: ""
        });
      }); 
    });
  
}

admin.addcatalogo = async (req, res)=>{
  let estado = await Estado.findOne({tienda:req.session.owner})
  let pedidos = await Confirmacion.find({'tienda': req.session.owner});
  let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
  let novistos = await pedidos.filter(novistos => novistos.confirmado == false);
  let categorias = await Categoria.find();
  let bar = await Bar.findById(req.session.owner)
  res.render('admin/catalogo', {
    novistos,
    estado,
    bar,
    categorias,
    pendientes,
    errorForm: ""
  });
}

admin.categoriasPage = async (req, res)=>{
  let estado = await Estado.findOne({tienda:req.session.owner})
  let pedidos = await Confirmacion.find({'tienda': req.session.owner});
  let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
  let novistos = await pedidos.filter(novistos => novistos.confirmado == false);
  let categorias = await Categoria.find();
  let bar = await Bar.findById(req.session.owner)
  res.render('admin/categorias', {
    novistos,
    estado,
    bar,
    categorias,
    pendientes,
  });
}

admin.profile = async (req, res)=>{
  let estado = await Estado.findOne({tienda:req.session.owner})
  let pedidos = await Confirmacion.find({'tienda': req.session.owner});
  let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
  let novistos = await pedidos.filter(novistos => novistos.confirmado == false);
  let bar = await Bar.findById(req.session.owner)
  res.render('admin/profile', {
    novistos,
    estado,
    bar,
    pendientes,
  });
}


admin.profileEmpresa = async (req, res)=>{
  let estado = await Estado.findOne({tienda:req.session.owner})
  let pedidos = await Confirmacion.find({'tienda': req.session.owner});
  let bar = await Bar.findById(req.session.owner)
  let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
  let novistos = await pedidos.filter(novistos => novistos.confirmado == false);
  res.render('admin/profile-empresa', {
    novistos,
    estado,
    pendientes,
    bar,
    session:req.session.owner,
  });

}


admin.apiEmpresa = async (req, res)=>{

  console.log(req.body.msj);

  await Bar.updateOne({_id: req.params.key}, req.body.msj).then(ok =>{
    res.send("ok");

  }).catch(err =>{
    res.send(err);
  });


}

admin.apiLogo = async (req,res)=>{


  if(req.file){

    var imagen = req.params.key.substring(0,5);

    var newname = "thumb3131"+ req.file.filename
  
    execute().catch(console.error);
    
    async function execute() {
      let image = await Image.load('src/assets/img/logo/'+req.file.filename+'');
      let grey = image
        .resize({ width: 300 , height: 150 }) // resize the image, forcing a width of 200 pixels. The height is computed automatically to preserve the aspect ratio.
  // rotate the image clockwise by 30 degrees.

       let bar = await Bar.findById({_id: req.params.key})


        await Bar.updateOne({_id: req.params.key},{ logo : newname});
        grey.save('src/assets/img/logo/'+newname+'').then(ok =>{
          res.send(newname)
          fs.unlinkSync('src/assets/img/logo/'+bar.logo+'');
        }).catch(err =>{
          res.send('error')
          console.log(err)
        });

        
    }

  
    fs.unlinkSync('src/assets/img/logo/'+req.file.filename+'');
}

}

admin.statuscomplete =  async (req, res)=>{
    var  id  = req.body.id;
    try {
  
      let task = await Confirmacion.findById(id);
      task.enviado = !task.enviado;
      let carrito =  await task.save();
  
      if(task.status == true){
  
       var params = {
          "lead_id": "",
          "to": "34"+task.phone+"",
          "from": "LOREMBAR"};
  
          datalyse.api('sendsms/smsmt',params,function(result) {
            console.log('DatalyseAPIOK: ',result);
          });
  
      }
      
      res.send(task.enviado);
  
      console.log(task.enviado);
  
      } catch (e) {

        console.log(e)
  
        res.send('keyError');
        
      }
}

admin.edit = async (req, res)=>{
    let { id } = req.params;
    let estado = await Estado.findOne({tienda:req.session.owner})
    let pedidos = await Confirmacion.find({'tienda': req.session.owner});
    let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
    let novistos = await pedidos.filter(novistos => novistos.confirmado == false);
    let categorias = await Categoria.find();
    let bar = await Bar.findById(req.session.owner)

    await Task.findById(id, function(err, task) {
      Categoria.populate(task, {path: "categoria"},function(err, task){
        console.log(task)
        res.render('admin/edit', {
          novistos,
          task,
          bar,
          categorias,
          estado,
          pendientes,
          errorForm: ""
        });
      }); 
    });
}

admin.delete = async (req, res) => {
  var id = req.body.id;
  console.log(id)
  try{
    
    let task = await Task.findById(id);
    console.log(task)
    if(task.urlImg){
    fs.unlinkSync('src/assets/img/carta/'+task.urlImg+'');
    }
    await Task.deleteOne({_id:id});
    res.send("ok");

  } catch (e) {
  
    console.log(e)
    
  }
  

  
}

admin.editmenu = async (req, res)=>{
    let { id } = req.params;
    await Task.updateOne({_id: id}, req.body);
    res.redirect('/back/admin/catalogo');
}

admin.addmenu = async (req, res)=>{
  let task = new Task(req.body);
  task.tienda = req.session.owner;
  if(req.file){
  task.urlImg = 'thumb'+req.file.filename
  }
  let tasksHome = await Task.find();
  let pedidos = await Confirmacion.find({'tienda': req.session.owner});
  let pendientes = pedidos.filter(pendientes => pendientes.enviado == false);
  let estado = await Estado.findOne({tienda:req.session.owner});
  let bar = await Bar.findById(req.session.owner)
  await task.save().then(ok  =>{
    res.redirect('/back/admin/catalogo');
  }).catch(err =>{
    console.log(err)
    res.render('/back/admin/catalogo', {
      tasksHome,
      estado,
      bar,
      pendientes,
      errorForm: "Todos los campos son obligatorios"
    });
  });

  /*Jimp.read('src/assets/img/carta/'+req.file.filename+'')
  .then(lenna => {
    return lenna
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(req.file.filename); // save
      console.log(lenna)
  })
  .catch(err => {
    console.error(err);
  });*/

/*sharp('src/assets/img/carta/'+req.file.filename+'').resize({ height:300, width:300}).toFile('src/assets/img/carta/dev_'+req.file.filename+'')
  .then(function(newFileInfo){
  console.log("Image Resized");
  })
  .catch(function(err){
  console.log("Got Error");
  });*/

  if(req.file){

      let { Image } = require('image-js');
    
      execute().catch(console.error);
      
      async function execute() {
        let image = await Image.load('src/assets/img/carta/'+req.file.filename+'');
        let grey = image
          .resize({ width: 300 }) // resize the image, forcing a width of 200 pixels. The height is computed automatically to preserve the aspect ratio.
    // rotate the image clockwise by 30 degrees.
        return grey.save('src/assets/img/carta/thumb'+req.file.filename+'');

        
      }

      fs.unlinkSync('src/assets/img/carta/'+req.file.filename+'');
  }

}



//create slug 

function string_to_slug (str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  let to   = "aaaaeeeeiiiioooouuuunc------";
  for (let i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

  return str;
}

module.exports = admin;