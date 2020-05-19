const express = require('express');
const router = express.Router();


// Middle 
const catalogo = require ('../controllers/catalogo.controller')
const follow = require ('../controllers/follow.controller')
const admin = require ('../controllers/admin.controller');
const passport = require('passport');
const uniqid = require('uniqid');
const multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/assets/img/logo/')
  },
  filename: (req ,file ,cb) =>{
    cb(null, uniqid() + file.originalname)
  }
})

var upload = multer({ storage: storage })

var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/assets/img/carta/')
    },
    filename: (req ,file ,cb) =>{
      cb(null,  uniqid() + file.originalname)
    }
  })
  
var uploadCarta = multer({ storage: storage2 })


// View Catalogo

router.get('/', catalogo.home);
router.get('/:slug/', catalogo.bares);
router.post('/addcarrito/:id', catalogo.add);
router.post('/deletecarrito/', catalogo.delete);
router.get('/:slug/confirmar/:id', catalogo.confirmar);
router.post('/:slug/confirmar/:id', catalogo.confirm);
 

// View Seguimiento

router.post('/seguimiento/', follow.pago);
router.get('/:slug/seguimiento/:id', follow.home)


// ADMINISTRACION

router.get('/back/login', admin.login);

router.post('/login', passport.authenticate('local-signin',{
    successRedirect: "/back/admin/",
    failureRedirect: "/back/login/"
}));
router.get('/create-user/:name/:password/:email', admin.createuser);
router.get('/create-r/:name/:owner', admin.creater);
router.get('/back/logout', admin.logout);
router.get('/back/admin', admin.AuthOk , admin.home);
router.get('/back/admin/pendientes', admin.AuthOk, admin.pendientes);
router.post('/back/admin/push/carito', admin.AuthOk, admin.pendientesCarrito);
router.get('/back/admin/completados', admin.AuthOk, admin.completados);
router.get('/back/admin/status/:id',admin.AuthOk, admin.status);
router.get('/back/admin/catalogo', admin.catalogo);
router.get('/back/admin/addcatalogo', admin.AuthOk, admin.addcatalogo);
router.post('/back/admin/complete/', admin.AuthOk, admin.statuscomplete);
router.get('/back/admin/edit/:id', admin.AuthOk, admin.edit);
router.post('/back/admin/edit/:id',admin.AuthOk,  admin.editmenu);
router.post('/back/admin/add', admin.AuthOk, uploadCarta.single('image'), admin.addmenu);
router.get('/back/admin/cerrartienda', admin.AuthOk, admin.cerrarpedidos);
router.post('/back/admin/delete-item', admin.AuthOk, admin.delete);

router.get('/back/admin/categorias', admin.AuthOk, admin.categoriasPage);

router.get('/back/admin/profile/user', admin.AuthOk, admin.profile);
router.get('/back/admin/profile/tienda', admin.AuthOk, admin.profileEmpresa);


// API PROFILE

router.post('/api/edit-profile/:key/', admin.apiEmpresa);
router.post('/api/upload-logo/:key/', upload.single('logoimg'), admin.apiLogo);

// Profile

router.post('/api/back/admin/visto/', admin.AuthOk, admin.visto);

module.exports = router;
