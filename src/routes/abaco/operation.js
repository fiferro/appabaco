var router = require('express').Router(),
  express = require("express"),
  bodyParser = require('body-parser'),
  conSql = require('../../controllers/dbConnections'),
  db = require('../../controllers/dbConnections'),
  mysql = require('mysql'),
  auth = require('basic-auth');
// rotas a serem chamadas a partir de /abaco. 
// para melhor direcionar o desenvolvimento as informações de operação deverão ficar aqui 
var querySql = db.querySql;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/operation", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "select * from Operacao";
        return querySql(userQuery, '')
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }
    });
});


router.get("/calculation", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "select * from TipoCalculo";
        return querySql(userQuery, '')
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }
    });
});

router.post("/operation", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "INSERT INTO Operacao (descOperacao, idCalculo) VALUES ('" + req.body.descOperacao + "','"+req.body.idCalculo+"')";
        return db.insertSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.patch("/operation", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "update Operacao set descOperacao = '" + req.body.descOperacao + "', idCalculo = '" + req.body.idCalculo + "' where idOperacao = " + req.body.idOperacao;
        return db.insertSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.delete("/operation", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "delete from Operacao where idOperacao = " + req.body.idOperacao;
        return db.deleteSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});




module.exports = router;