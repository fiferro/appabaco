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

router.get("/abaco/parcelas/:idAbaco", function (req, res) {
  let idAbaco = req.params.idAbaco
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliQuery = " SELECT * FROM AbacoParc WHERE idAbaco = '" + idAbaco + "' ORDER BY dataVencimento ASC";
        return querySql(cliQuery, '')
          .then(function (rows) {
            res.status(200).json(rows);
          });
      }
    });
});

router.get("/abaco/pagamentos/:idAbacoPagamento", function (req, res) {
  let idAbacoPagamento = req.params.idAbacoPagamento
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var cliQuery = " SELECT * FROM AbacoParc WHERE idAbacoParcela = '" + idAbacoPagamento + "'";
        return querySql(cliQuery, '')
          .then(function (rows) {
            res.status(200).json(rows);
          });
      }
    });
});


router.post("/abaco", function (req, res) {
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
          .then(function (Abaco) {
            for (i = 0; i < req.body.vlrParcelas.length; i++) {
              var valid = 0;
              var CliParc = "INSERT INTO AbacoParc"
              CliParc += "(idAbaco,valorParcela,dataVencimento,status) values ("
              CliParc += " '" + Abaco.insertId + "', '" + req.body.vlrParcelas[i][0] + "', '" + req.body.vlrParcelas[i][1] + "', '0')"
              console.log(CliParc);
              db.insertSql(CliParc)
                .then(function (err, returns) {
                  if (err) {
                    valid += 1
                  }
                  else {
                    valid += 0
                  }
                });
            }

            if (valid == 0) {
              res.status(200).json({ returns: 'OK' });
            }
            else {
              res.status(400).json({ returns: 'Invalid' });
            }
          });
      }
    });
});

router.post("/abaco/calculation", function (req, res) {
  let id = ''
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
            console.log(rows[0].idCalculo)
            if (rows[0].idCalculo == 1) {
              //calculo Semanal
              let meses = parseInt(req.body.parcelas) / 4;
              let parcelas = Math.round(meses)
              let paymentValor = parseFloat(req.body.valor) * (parseFloat(req.body.perc) / 100);
              let paymentValorWK = (paymentValor * parcelas) / req.body.parcelas
              let inst_payment = parseFloat(req.body.valor) / parseInt(req.body.parcelas)
              inst_payment = inst_payment + paymentValorWK;
              paymentTot = inst_payment * parseInt(req.body.parcelas);
              res.status(200).json({ paymentTot: paymentTot, inst_payment: inst_payment, qtdDias: rows[0].qtdDias });
            }
            else if (rows[0].idCalculo == 2) {
              let paymentValor = parseFloat(req.body.valor) * (parseFloat(req.body.perc) / 100);
              let inst_payment = parseFloat(req.body.valor) / parseInt(req.body.parcelas)
              inst_payment = inst_payment + paymentValor;
              paymentTot = inst_payment * parseInt(req.body.parcelas);
              res.status(200).json({ paymentTot: paymentTot, inst_payment: inst_payment, qtdDias: rows[0].qtdDias });
            }
            else if (rows[0].idCalculo == 3) {
              let meses = parseInt(req.body.dias) / 30
              meses = Math.round(meses)
              let paymentValor = parseFloat(req.body.valor) * (parseFloat(req.body.perc) / 100);
              paymentValor = paymentValor * meses;
              let inst_paymentday = parseFloat(paymentValor) / parseInt(req.body.dias)
              let totDay = parseFloat(req.body.valor) / parseInt(req.body.dias)
              inst_payment = totDay + inst_paymentday;
              inst_payment = parseFloat(inst_payment.toFixed(2));
              paymentTot = inst_payment * parseInt(req.body.dias);
              res.status(200).json({ paymentTot: paymentTot, inst_payment: inst_payment, qtdDias: 0 });
            }
            else {
              console.log('Sem calculo')
            }
          })

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

router.patch("/abaco/parcelas", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var parcelamentoUpdate = "update AbacoParc set "
        parcelamentoUpdate += " dataVencimento = '" + req.body.dtVenc + "',"
        parcelamentoUpdate += " status = '" + req.body.status + "',"
        parcelamentoUpdate += " dataPagamento = '" + req.body.dtPgto + "',"
        parcelamentoUpdate += " valorPago = '" + req.body.vlrPago + "'"
        parcelamentoUpdate += " where idAbacoParcela = '" + req.body.idAbacoParcela + "'";


        if (req.body.ValorFaltante) {
          var cliQuery = " SELECT max(s.dataVencimento) dtVencimaneo FROM AbacoParc s WHERE idAbaco = '" + req.body.idAbaco + "'";
          return querySql(cliQuery, '')
            .then(function (rows) {
              let dtvenc = 
              dtVenc = new Date(rows[0].dtVencimaneo);
              dtVenc = dtVenc.getFullYear() + '-' + (dtVenc.getMonth() + 1).toString().padStart(2, '0') + '-' + dtVenc.getDate().toString().padStart(2, '0');
              console.log(dtVenc);
              var CliParc = "INSERT INTO AbacoParc"
              CliParc += "(idAbaco,valorParcela,dataVencimento,status,  idAbacParcPai) values ("
              CliParc += " '" + req.body.idAbaco + "', '" +req.body.ValorFaltante + "', '" + dtVenc  + "', '0', '"+req.body.idAbacoParcela+"')"
              console.log(CliParc);
              db.insertSql(CliParc)
                .then(function (err, returns) {
                  return db.insertSql(parcelamentoUpdate)
                    .then(function (returns) {
                      res.status(200).json({ returns });
                    });
                });
            });
        }
        else {
          return db.insertSql(parcelamentoUpdate)
            .then(function (returns) {
              res.status(200).json({ returns });
            });
        }
      }
    });
});

router.delete("/abaco/zeraParcela", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var garantiaInsert = "delete from AbacoParc where idAbacParcPai = " + req.body.idAbacoParcela;
        return db.deleteSql(garantiaInsert)
          .then(function (returns) {
            var parcelamentoUpdate = "update AbacoParc set "
            parcelamentoUpdate += " status = '0',"
            parcelamentoUpdate += " dataPagamento = null,"
            parcelamentoUpdate += " valorPago = null "
            parcelamentoUpdate += " where idAbacoParcela = '" + req.body.idAbacoParcela + "'";

            return db.insertSql(parcelamentoUpdate)
            .then(function (returns) {
              res.status(200).json({ returns });
            });
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



module.exports = router;