var router = require('express').Router(),
  express = require("express"),
  bodyParser = require('body-parser'),
  conSql = require('../../controllers/dbConnections'),
  db = require('../../controllers/dbConnections'),
  mysql = require('mysql'),
  auth = require('basic-auth');
// rotas a serem chamadas a partir de /abaco. 
// para melhor direcionar o desenvolvimento as informações de vendor deverão ficar aqui 
var querySql = db.querySql;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/vendor", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "select * from Vendor";
        return querySql(userQuery, '')
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }
    });
});

router.get("/vendor/:idVendor", function (req, res) {
  let idVendor = req.params.idVendor
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "select * from Vendor where idVendor = " + idVendor ;
        return querySql(userQuery, '')
          .then(function (rows) {
            if (rows.length == 0) {
              res.status(400).json({ 'return': '' });
            }
            res.status(200).json({ rows });
          });
      }
    });
});

router.post("/vendor", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userInsert = "INSERT INTO Vendor (nomeVendor, contatoVendor, apelidoVendor, comissaoVendor) VALUES ('" + req.body.nomeVendor + "','" + req.body.contatoVendor + "','" + req.body.apelidoVendor + "','" + req.body.comissaoVendor + "')";
        return db.insertSql(userInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    })
});

router.patch("/vendor", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userInsert = "update Vendor set nomeVendor = '" + req.body.nomeVendor + "',contatoVendor = '" + req.body.contatoVendor + "', apelidoVendor = '" + req.body.apelidoVendor + "' , comissaoVendor = '" + req.body.comissaoVendor + "' where idVendor = " + req.body.idVendor;
        return db.insertSql(userInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.delete("/vendor", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userDelete = "delete from Vendor where idVendor = " + req.body.idVendor;
        return db.deleteSql(userDelete)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

module.exports = router;