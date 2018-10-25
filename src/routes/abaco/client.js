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

router.get("/client", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliQuery = "SELECT * ";
        cliQuery += "FROM Cliente C "
        cliQuery += "LEFT JOIN Garantia G  ON  C.idWarranty = G.idGarantia ";
        return querySql(cliQuery, '')
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }
    });
});

router.get("/client/:idClient", function (req, res) {
  let idClient = req.params.idClient
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliQuery = "SELECT * ";
        cliQuery += "FROM Cliente C "
        cliQuery += "LEFT JOIN Garantia G  ON  C.idWarranty = G.idGarantia ";
        cliQuery += "WHERE idCliente = " + idClient;
        return querySql(cliQuery, '')
          .then(function (rows) {
            res.status(200).json(rows);
          });
      }
    });
});

router.post("/client", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliInsert = "INSERT INTO Cliente"
        cliInsert += "(nameCliente,cpfCliente,rgCliente,birthCliente,adressCliente,phoneCliente,cellCliente,companyCliente,officeCliente,rentCliente,"
        cliInsert += "adressCompanyCliente,nameMassClient1,phonemassCliente1,nameMassCliente2,phoneMassCliente2,idWarranty, indClient, indNameClient, dtCadClient, abrvClient,"
        cliInsert += " especGarantia, facebook, instagran  ) VALUES (";
        cliInsert += " '" + req.body.nameCliente + "','" + req.body.cpfCliente + "', '" + req.body.rgCliente + "', '" + req.body.birthCliente + "',"
        cliInsert += " '" + req.body.adressCliente + "', '" + req.body.phoneCliente + "', '" + req.body.cellCliente + "', '" + req.body.companyCliente + "',"
        cliInsert += " '" + req.body.officeCliente + "','" + req.body.rentCliente + "', '" + req.body.adressCompanyCliente + "', '" + req.body.nameMassClient1 + "',"
        cliInsert += " '" + req.body.phonemassCliente1 + "','" + req.body.nameMassCliente2 + "', '" + req.body.phoneMassCliente2 + "', '" + req.body.idWarranty + "',"
        cliInsert += " '" + req.body.indClient + "','" + req.body.indNameClient + "', '" + req.body.dtCadClient + "', '" + req.body.abrvClient + "',"
        cliInsert += " '" + req.body.especWarranty + "','" + req.body.facebook + "', '" + req.body.instagran + "')"

        return db.insertSql(cliInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.patch("/client", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "update Cliente set "
        garantiaInsert += " nameCliente = '" + req.body.nameCliente + "',"
        garantiaInsert += " cpfCliente = '" + req.body.cpfCliente + "',"
        garantiaInsert += " rgCliente = '" + req.body.rgCliente + "',"
        garantiaInsert += " birthCliente = '" + req.body.birthCliente + "',"
        garantiaInsert += " adressCliente = '" + req.body.adressCliente + "',"
        garantiaInsert += " phoneCliente = '" + req.body.phoneCliente + "',"
        garantiaInsert += " cellCliente = '" + req.body.cellCliente + "',"
        garantiaInsert += " companyCliente = '" + req.body.companyCliente + "',"
        garantiaInsert += " officeCliente = '" + req.body.officeCliente + "',"
        garantiaInsert += " rentCliente = '" + req.body.rentCliente + "',"
        garantiaInsert += " adressCompanyCliente = '" + req.body.adressCompanyCliente + "',"
        garantiaInsert += " nameMassClient1 = '" + req.body.nameMassClient1 + "',"
        garantiaInsert += " phonemassCliente1 = '" + req.body.phonemassCliente1 + "',"
        garantiaInsert += " nameMassCliente2 = '" + req.body.nameMassCliente2 + "',"
        garantiaInsert += " phoneMassCliente2 = '" + req.body.phoneMassCliente2 + "',"
        garantiaInsert += " indClient = '" + req.body.indClient + "',"
        garantiaInsert += " idWarranty = '" + req.body.idWarranty + "',"
        garantiaInsert += " indNameClient = '" + req.body.indNameClient + "',"
        garantiaInsert += " dtCadClient = '" + req.body.dtCadClient + "',"
        garantiaInsert += " abrvClient = '" + req.body.abrvClient + "',"
        garantiaInsert += " especGarantia = '" + req.body.especWarranty + "',"
        garantiaInsert += " facebook = '" + req.body.facebook + "',"
        garantiaInsert += " instagran = '" + req.body.instagran + "'"
        garantiaInsert += "where idCliente = " + req.body.idCliente;
        return db.insertSql(garantiaInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});

router.delete("/client", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('Problema com a autorização');
      }
      else {
        var cliQuery = "  SELECT * FROM Abaco A";
        cliQuery += " WHERE A.idCliente = " + req.body.idCliente;
        return querySql(cliQuery, '')
          .then(function (client) {
            if (client.length != 0) {
              res.status(501).json('Não foi possivel excluir o cliente pois o mesmo está vinculado a um processo Abaco' );
            }
            else{
            var garantiaInsert = "delete from Cliente where idCliente = " + req.body.idCliente;
            return db.deleteSql(garantiaInsert)
              .then(function (returns) {
                res.status(200).json({ returns });
              });
            }
          });
      }
    });
});

module.exports = router;