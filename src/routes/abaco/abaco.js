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

router.get("/abaco", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliQuery = "  SELECT * FROM Abaco A";
        cliQuery += "  LEFT JOIN Cliente C on C.idCliente = A.idCliente "
        cliQuery += "  LEFT JOIN Garantia G on G.idGarantia = A.idGarantia "
        cliQuery += "   LEFT JOIN Vendor V  on V.idVendor = A.idVendor  "
        cliQuery += " LEFT JOIN Operacao O on O.idOperacao = A.idOperacao ";
        return querySql(cliQuery, '')
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }
    });
});

router.get("/abaco/:idAbaco", function (req, res) {
  let idAbaco = req.params.idAbaco
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliQuery = "  SELECT * FROM Abaco A";
        cliQuery += "  LEFT JOIN Cliente C on C.idCliente = A.idCliente "
        cliQuery += "  LEFT JOIN Garantia G on G.idGarantia = A.idGarantia "
        cliQuery += "   LEFT JOIN Vendor V  on V.idVendor = A.idVendor  "
        cliQuery += " LEFT JOIN Operacao O on O.idOperacao = A.idOperacao ";
        cliQuery += "WHERE A.idAbaco = " + idAbaco;
        return querySql(cliQuery, '')
          .then(function (rows) {
            res.status(200).json(rows);
          });
      }
    });
});

router.post("/abaco", function (req, res) {
  console.log('entrou no post do Abaco')
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliInsert = "INSERT INTO Abaco"
        cliInsert += "(idCliente,idVendor,idGarantia,idOperacao,valor,parcelas,perc,totalParcela,Total,dataOperacao,diaOperacao) values ("
        cliInsert += " '" + req.body.idClient + "', '" + req.body.idVendor + "', '" + req.body.idGarantia + "', '" + req.body.idOperacao + "',"
        cliInsert += " '" + req.body.valor + "', '" + req.body.parcelas + "', '" + req.body.perc + "', '" + req.body.totalParcela + "',"
        cliInsert += " '" + req.body.Total + "','" + req.body.dataOperacao + "', '" + req.body.diaOperacao + "')"
        return db.insertSql(cliInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.patch("/abaco", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        
        var garantiaInsert = "update Abaco set "
        garantiaInsert += " idCliente = '" + req.body.idClient + "',"
        garantiaInsert += " idVendor = '" + req.body.idVendor + "',"
        garantiaInsert += " idGarantia = '" + req.body.idGarantia + "',"
        garantiaInsert += " idOperacao = '" + req.body.idOperacao + "',"
        garantiaInsert += " valor = '" + req.body.valor + "',"
        garantiaInsert += " parcelas = '" + req.body.parcelas + "',"
        garantiaInsert += " perc = '" + req.body.perc + "',"
        garantiaInsert += " totalParcela = '" + req.body.totalParcela + "',"
        garantiaInsert += " Total = '" + req.body.Total + "',"
        garantiaInsert += " dataOperacao = '" + req.body.dataOperacao + "',"
        garantiaInsert += " diaOperacao = '" + req.body.diaOperacao + "'"
        garantiaInsert += " where idAbaco = " + req.body.idAbaco;
        return db.insertSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.delete("/abaco", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "delete from Abaco where idAbaco = " + req.body.idAbaco;
        return db.deleteSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.post("/abaco/calculation", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliQuery = "  SELECT * FROM Operacao A ";
        cliQuery += "WHERE A.idOperacao = " + req.body.tpCalculo;
        querySql(cliQuery, '')
          .then(function (rows) {
            if (rows[0].idCalculo == 1) {
              //calculo Semanal
              let inst_payment = parseFloat(req.body.valor) / parseInt(req.body.parcelas)
              inst_payment = inst_payment + (inst_payment * (parseFloat(req.body.perc) / 100));
              paymentTot = inst_payment * parseInt(req.body.parcelas)
              res.status(200).json({ paymentTot: paymentTot, inst_payment: inst_payment });
              console.log()
            }
            else if (rows[0].idCalculo == 2) {
              let inst_payment =(parseFloat(req.body.valor) +  (parseFloat(req.body.valor) * (parseFloat(req.body.perc) / 100)) )/ parseInt(req.body.parcelas)
              paymentTot = inst_payment * parseInt(req.body.parcelas)
              res.status(200).json({ paymentTot: paymentTot, inst_payment: inst_payment });
            }
            else {
              console.log('Sem calculo')
            }
          })

      }
    });
});

module.exports = router;