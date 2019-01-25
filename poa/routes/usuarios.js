var express = require('express');
var router = express.Router();
var cors = require('cors');
router.use(cors());
var mongoCliente = require("mongodb").MongoClient;
//crear bd de antes 
const url = "mongodb://localhost:27017";
const dbName ="Libreria";
var ObjectId = require("mongodb").ObjectId;
router.get('/', function(req,res,next){
    mongoCliente.connect(url, function(err,client){
        if(err) throw err;
        console.log("Connected corretly to server");
        const db = client.db(dbName);
        var query ={};
        db.collection("Persona").find(query).toArray(function(err,result){
            if(err) throw err;
            console.log(result);
           // res.render(result);
           res.render('allusers',{usuarios:result,page:"allusers"});
            client.close();
        });
    });
});
//////////////////////////////////
router.get('/getDatos', function(req,res,next){
    mongoCliente.connect(url, function(err,client){
        if(err) throw err;
        console.log("Connected corretly to server");
        const db = client.db(dbName);
        var query ={};
        db.collection("alumnos").find(query).toArray(function(err,result){
            if(err) throw err;
            console.log(result);
           // res.render(result);
           res.send(result);
            client.close();
        });
    });
});
router.get('/alta', function(req, res, next) {
    res.render('formuser',{page:"usuarios",ope:"c"});
});
router.get('/modificar/:id', function(req, res, next) {
    console.log(req.params.id);
    var oId = new ObjectId(req.params.id);
    var query = {"_id": oId};
    mongoCliente.connect(url, function(err,client){
        if (err) throw err;
        const db = client.db(dbName);
        db.collection("Persona").findOne(query,function(err,result){
            var string=JSON.stringify(result);
            console.log('>> string: ', string );
            var json =  JSON.parse(string);
            res.render('formuser',{usuarios:json,page:"usuarios",ope:"u"});
            client.close();
        });
   });    
});
//alta,modificar,eliminar
router.post('/operacion', function(req, res, next) {  
    var tipoOperacion = "";ç
    var nombre ="";ç
    var apellido="";
    var usuario="";
    var rol="";
    var correo="";
    var contraseña="";
    var query = "";
    var id="";
    //console.log(req);ç
    tipoOperacion = req.body.ope;
    if (tipoOperacion == "c") {
        //Ligar los datos con los campos
      	nombre = req.body.nombre;
      	apellido = req.body.apellido;
      	usuario = req.body.usuario;
        rol = req.body.rol;
        correo = req.body.correo;
        contraseña=req.body.contraseña;
        mongoCliente.connect(url, function(err,client){
            if (err) throw err;
            const db = client.db(dbName);
            var query =  {"Nombre":nombre,"Apellido":apellido,"Usuario":usuario,"Rol":rol,"Contraseña":contraseña,"Correo":correo};
            db.collection("Persona").insertOne(query,function(err,result){
            if (err) throw err;
            //console.log(result);
            if (parseInt(result.insertedCount.toString()) > 0) {
                return res.send("1");
            }
            client.close();
        });
       });
       //query = "INSERT INTO usuarios (nombre,apellido,edad) VALUES('"+nombre+"','"+apellido+"',"+edad+");";
     }else if(tipoOperacion == "u"){
        nombre = req.body.nombre;
      	apellido = req.body.apellido;
        usuario = req.body.usuario;
        rol = req.body.rol;
        correo = req.body.correo;
        contraseña = req.body.contraseña;  
      	id = req.body.id;
        mongoCliente.connect(url, function(err,client){
            if (err) throw err;
            var oId = new ObjectId(id);
            var query = {"_id": oId};
            var nuevosValores = {"Nombre":nombre,"Apellido":apellido,"Usuario":usuario,"Rol":rol,"Contraseña":contraseña,"Correo":correo};
            console.log(nuevosValores);
            const db = client.db(dbName);
            db.collection("Persona").update(query,nuevosValores,function(err,resul){
                if (err) throw err;
                //console.log(result);
                if (parseInt(resul.result.nModified.toString()) > 0) {
                    return res.send("1");
                }
            client.close();
        });
    });
    //   query = "UPDATE usuarios SET nombre = '"+nombre+"', apellido = '"+apellido+"', edad="+edad+" WHERE id = "+id+" ";
    }else if(tipoOperacion == "d"){
     	id = req.body.id;
        mongoCliente.connect(url, function(err,client){
            if (err) throw err;
            var oId = new ObjectId(id);
            var query = {"_id": oId};
            const db = client.db(dbName);
            db.collection("Persona").deleteOne(query,function(err,resul){
                if (err) throw err;
                console.log(resul);
                if (parseInt(resul.deletedCount.toString()) > 0) {
                    return res.send("1");
                }
            client.close();
        });
    });
    //  query = "DELETE FROM usuarios WHERE id = "+id+" ";
    }
});
module.exports = router;