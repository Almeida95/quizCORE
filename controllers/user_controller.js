var models = require('../models');
var Sequelize = require('sequelize');


// Autoload el user asociado a :userId
exports.load = function(req, res, next, userId) {
    models.User.findById(userId)
        .then(function(user) {
            if (user) {
                req.user = user;
                next();
            } else {
                req.flash('error', 'No existe el usuario con id='+id+'.');
                next(new Error('No existe userId=' + userId));
            }
        })
        .catch(function(error) { next(error); });
};


// GET /users
exports.index = function(req, res, next) {
    models.User.findAll({order: ['username']})
        .then(function(users) {
            res.render('users/index', { users: users });
        })
        .catch(function(error) { next(error); });
};


// GET /users/:id
exports.show = function(req, res, next) {
    res.render('users/show', {user: req.user});
};


// GET /users/new
exports.new = function(req, res, next) {
    var user = models.User.build({ username: "", 
                                   password: "" });

    res.render('users/new', { user: user });
};


// POST /users
exports.create = function(req, res, next) {


    var user = models.User.build({ username: req.body.user.username,
                                   password: req.body.user.password
                                });

    // El login debe ser unico:
    models.User.find({where: {username: req.body.user.username}})
        .then(function(existing_user) {
            if (existing_user) {
                var emsg = "El usuario \""+ req.body.user.username +"\" ya existe."
                req.flash('error', emsg);
                res.render('users/new', { user: user });
            } else {
                // Guardar en la BBDD
                return user.save({fields: ["username", "password", "salt"]})
                    .then(function(user) { // Renderizar pagina de usuarios
                        req.flash('success', 'Usuario creado con éxito.');
                        res.redirect('/session'); //Redirección a página de login
                    })
                    .catch(Sequelize.ValidationError, function(error) {
                        req.flash('error', 'Errores en el formulario:');
                        for (var i in error.errors) {
                            req.flash('error', error.errors[i].value);
                        };
                        res.render('users/new', { user: user });
                    });
            }
        })
        .catch(function(error) { 
            next(error);
        });
};


// GET /users/:id/edit
exports.edit = function(req, res, next) {
    res.render('users/edit', { user: req.user });  // req.user: instancia de user cargada con autoload
};            


// PUT /users/:id
exports.update = function(req, res, next) {

    req.user.username  = req.body.user.username;
    req.user.password  = req.body.user.password;

    req.user.save({fields: ["username", "password", "salt"]})
        .then(function(user) {
            req.flash('success', 'Usuario actualizado con éxito.');
            res.redirect('/users');  // Redirección HTTP a /
        })
        .catch(Sequelize.ValidationError, function(error) {

            req.flash('error', 'Errores en el formulario:');
            for (var i in error.errors) {
                req.flash('error', error.errors[i].value);
            };

            res.render('users/edit', {user: req.user});
        })
        .catch(function(error) {
            next(error);
        });
};


// DELETE /users/:id
exports.destroy = function(req, res, next) {
    req.user.destroy()
        .then(function() {

            if (req.session.user && req.session.user.id === req.user.id){
                delete req.session.user;
            }
            req.flash('success', 'Usuario eliminado con éxito.');
            res.redirect('/users');
        })
        .catch(function(error){ 
            next(error); 
        });
};

// MW que permite acciones solamente si al usuario logeado es admin o es el autor del quiz.
exports.ownershipRequired = function(req, res, next){

    var isAdmin      = req.session.user.isAdmin;
    var quizAuthorId = req.quiz.AuthorId;
    var loggedUserId = req.session.user.id;

    if (isAdmin || quizAuthorId === loggedUserId) {
        next();
    } else {
      console.log('Operación prohibida: El usuario logeado no es el autor del quiz, ni un administrador.');
      res.send(403);
    }
};