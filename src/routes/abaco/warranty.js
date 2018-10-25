var router = require('express').Router(),
  express = require("express"),
  bodyParser = require('body-parser'),
  conSql = require('../../controllers/dbConnections'),
  db = require('../../controllers/dbConnections'),
  mysql = require('mysql'),
  auth = require('basic-auth');
// rotas a serem chamadas a partir de /abaco. 
// para melhor direcionar o desenvolvimento as informações de garantia deverão ficar aqui 
var querySql = db.querySql;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/warranty", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "select * from Garantia";
        return querySql(userQuery, '')
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }
    });
});

router.post("/warranty", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "INSERT INTO Garantia (descGarantia) VALUES ('" + req.body.descGarantia + "')";
        return db.insertSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.patch("/warranty", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "update Garantia set descGarantia = '" + req.body.descGarantia + "' where idGarantia = " + req.body.idGarantia;
        return db.insertSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.delete("/warranty", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "delete from Garantia where idGarantia = " + req.body.idGarantia;
        return db.deleteSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

module.exports = router;