var models = require('../models');

// GET /question
exports.question = function(req, res, next){
	models
	.Quiz
	.findOne() //Busca la primera pregunta en la tabla Quiz,  si la busqueda findOne() tiene exito se ejecutara la funcio de then
	.then(function(quiz){
		if(quiz){ //Si encuentra una pregunta la pasa como un objeto isomorfico en js en el parametro quiz
			var answer = req.query.answer || "";
			res
			.render('quizzes/question', {question: 'Capital de Italia',
								         answer: answer});
		}
	    else{
	    	throw new Error('No hay preguntas en la BBDD');  //Si el parametro quiz es null pues lo dices y ya esta
	    }
	}).catch(function(error) {next(error);});  //Esto por sio hubiere errores
};

// GET /check
exports.check = function(req,res,next){
	models
	.Quiz
	.findOne()  //Busca la primera pregunta
	.then(function(quiz){
		if (quiz){
			var answer = req.query.answer || "";
			var result = answer === quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizzes/result', {result:result,
		                        		  answer: answer});
		}
		else {
			throw new Error('No hay preguntas en la BBDD');
		}
	}).catch(function(error){ next(error); });
};