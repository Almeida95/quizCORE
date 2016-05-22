var path = require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQlite:
var sequelize = new Sequelize(null,null,null, {dialect: "sqlite", storage: "quiz.sqlite"});

//Importar la definicion de la tabla quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize
.sync()
.then(function() { //sync(( crea la tabla quiz
	return
		Quiz
		.count()
		.then(function (c){
			if (c===0){ // la tabla se inicializa si esta vacía
		 	   return
		  	   	Quiz
		  	    .create({ question: 'Capital de Italia', answer: 'Roma'})
		   	    .then(function(){
		    	   console.log('Base de datos inicializada con datos');
		    });
		}
	});
}).catch(function(error){
	console.log("Error Sincronizando las tablas de la BBDD:", error);
	process.exit(1);
});

exports.Quiz = Quiz; //esportar definicion de tabla quiz