const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config({path: 'variables.env'});
///POST
exports.autenticarUsuario = async (req, res, next) =>{
  ///Revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
   return res.status(400).json({errores: errores.array()});   
  }

  ///Buscar si el usuario esta registrado
  const {email, password} = req.body;

  const usuario = await Usuario.findOne({email});
  if(!usuario){
      res.status(401).json({msg: "El usuario no existe"});
    return next();
  }

  ///Verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)){
	///Crear JWT
	const token = jwt.sign({
	  id: usuario._id,
	  nombre: usuario.nombre,
	  email: usuario.email
	}, process.env.SECRETA,{
	  expiresIn: '8h'
	});
      res.json({token});
    }else{
      res.status(401).json({msg: "El password no Coincide"});
      return next();
    }
}
///GET
exports.usuarioAutenticado = async (req, res, next) =>{
  res.json({usuario: req.usuario});
}
