var express = require('express');
var router = express.Router();
var mongoCliente = 
require("mongodb").MongoClient;
var cors = require('cors');
router.use(cors());
var url = "mongodb://localhost:27017";
const dbName = "local";
var ObjectId = require("mongodb").ObjectId;
router.get('/', function(req, res, next){
    mongoCliente.connect(url, function(err, client){
        if (err) throw err;
        console.log("Connected correctly to server");
        const dbB = client.db(dbName);
        var query = {}
        dbB.collection("Libro").find(query).toArray(function(err, result){
            if (err) throw err;
            console.log(result);
            res.render('Libro',{
                             libros:result,
                             page:"Libro"
                         });
            client.close();
        });
    });
});
router.get('/getLibro', function(req, res, next){
    mongoCliente.connect(url, function(err, client){
        if (err) throw err;
        console.log("Connected correctly to server");
        const dbB = client.db(dbName);
        var query = {}
        dbB.collection("Libro").find(query).toArray(function(err, result){
            if (err) throw err;
            console.log(result);
            res.send(result)
            client.close();
        });
    });
});
router.get('/alta', function(req, res, next) {
    res.render('frmusuario',{page:"Libro",ope:"c"});
});
router.get('/modificar/:id', function(req, res, next) {
    console.log(req.params.id);
    var oId = new ObjectId(req.params.id);
    var query = {"_id": oId};
    mongoCliente.connect(url, function(err,db){
    if (err) throw err;
    const dbB = db.db(dbName);
    dbB.collection("Libro").findOne(query,function(err,result){
        var string=JSON.stringify(result);
        console.log('>> string: ', string );
        var json =  JSON.parse(string);
        res.render('frmusuario',{libro:json,page:"Libro",ope:"u"});
        db.close();
        });
    });
});
router.post('/operacion', function(req, res, next) {
    var tipoOperacion = "";
    var titulo ="";
    var editorial="";
    var autor ="";
    var autor ="";
    var imagen = "";
    var id="";
    tipoOperacion = req.body.ope;
    if (tipoOperacion == "c") {
        titulo = req.body.titulo;
        editorial = req.body.editorial;
        autor = req.body.autor;
        imagen = req.body.imagen;
        mongoCliente.connect(url, function(err,db){
            if (err) throw err;
            const dbB = db.db(dbName);
            var query = {"Titulo":titulo,"Editorial":editorial,"Autor":autor,"Imagen":imagen};
            dbB.collection("Libro").insert(query,function(err,result){
                if (err) throw err;
                if (parseInt(result.insertedCount.toString()) > 0) {
                    return res.send("1");
                }
                db.close();
            });
        });
    }else if(tipoOperacion == "u"){         
        titulo = req.body.titulo;
        editorial = req.body.editorial;
        autor = req.body.autor;
        imagen = req.body.imagen;
        id = req.body.id;
        mongoCliente.connect(url, function(err,db){
            if (err) throw err;
            const dbB = db.db(dbName);
            var oId = new ObjectId(id);
            var query = {"_id": oId};
            var query = {"Titulo":titulo,"Editorial":editorial,"Autor":autor,"Imagen":imagen};
            dbB.collection("Libro").update(query,nuevosValores,function(err,resul){
                if (err) throw err;
                if (parseInt(resul.result.nModified.toString()) > 0) {
                    return res.send("1");
                }
                db.close();
            });
        });
    }else if(tipoOperacion == "d"){
        id = req.body.id;
        mongoCliente.connect(url, function(err,db){
            if (err) throw err;
            const dbB = db.db(dbName);
            var oId = new ObjectId(id);
            var query = {"_id": oId};
            dbB.collection("Libro").deleteOne(query,function(err,resul){
                if (err) throw err;
                console.log(resul);
                if (parseInt(resul.deletedCount.toString()) > 0) {
                    return res.send("1");
                }
                db.close();
            });
        });
    }
});
module.exports = router;