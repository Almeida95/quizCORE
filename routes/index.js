var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController=require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//Autoload de rutas que usen :quizId

router.param('quizId',quizController.load);  //autoload:quizId
router.param('userId',userController.load);  //autoload:userId

//GET creditos
router.get('/author', function(req, res, next) {
res.render('author');
});

router.get('/quizzes.:format?',                     	quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?',       	quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',           	quizController.check);
router.get('/quizzes/new',                  sessionController.loginRequired,quizController.new);
router.post('/quizzes',                     sessionController.loginRequired,quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',   sessionController.loginRequired,quizController.edit);
router.put('/quizzes/:quizId(\\d+)',        sessionController.loginRequired,quizController.update);
router.delete('/quizzes/:quizId(\\d+)',     sessionController.loginRequired,quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/comments/new',  sessionController.loginRequired,commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',     sessionController.loginRequired,commentController.create);


// Definición de rutas de cuenta
router.get('/users',                    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',      userController.show);    // ver un usuario
router.get('/users/new',                userController.new);     // crear usuario
router.post('/users',                   userController.create);  // registrar usuario
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired,userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',      sessionController.loginRequired,userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',   sessionController.loginRequired,userController.destroy);  // borrar cuenta

//Definición de rutas de sesión de usuario

router.get('/session',    sessionController.new);     // Login
router.post('/session',   sessionController.create);  // Crear nueva
router.delete('/session', sessionController.destroy); // Destruir sesión

module.exports = router;
