var path = require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');

var url, storage

if(!process.env.DATABASE_URL){
	url = "sqlite:///";
	storage = "quiz.sqlite";
} else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url,{storage: storage,omitNull: true});

//Importar la definicion de la tabla quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

var Comment = sequelize.import(path.join(__dirname,'comment'));

//Importar la definicion de la tabla Users de user.js
var User = sequelize.import(path.join(__dirname,'user'));

var Attachment = sequelize.import(path.join(__dirname,'attachment'));

//Relaciones entre modelos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Relación 1 a N entre User y Quiz:
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

//Relacion 1-a-1 entre Quiz y Attachment

Attachment.belongsTo(Quiz);
Quiz.hasOne(Attachment);

//Relación 1 a N entre Autores y Comentarios

User.hasMany(Comment,{foreignKey: 'AuthorId'});
Comment.belongsTo(User,{as:'Author', foreignKey: 'AuthorId'});


exports.Quiz = Quiz; //exportar definicion de tabla quiz
exports.Comment = Comment; //Exportar definicion de tabla Comments
exports.User = User; //Exportar definicion de tabla Users
exports.Attachment = Attachment //Exportar definción de tabla Attachments