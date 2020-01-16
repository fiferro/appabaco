var router = require('express').Router(),
  express = require("express"),
  bodyParser = require('body-parser'),
  db = require('../../controllers/dbConnections');
// rotas a serem chamadas a partir de /abaco. 
// para melhor direcionar o desenvolvimento as informações de vendor deverão ficar aqui 
var querySql = db.querySql;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/payments", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "select c.nameCliente, a.Total,ap.valorPago, ap.dataVencimento, ap.dataPagamento, (select v.nomeVendor from Vendor v where  v.idVendor = a.idVendor) as nomeVendor from Cliente c"
        userQuery += " inner join Abaco a on a.idCliente = c.idCliente "
        userQuery += " inner join AbacoParc ap on ap.idAbaco = a.idAbaco "
        userQuery += " where 1 = 1" 
        if (req.body.name ){
            userQuery += " and UPPER(c.nameCliente) like UPPER('%"+req.body.name+"%')"
        }
        if (req.body.dtIni ){
            userQuery += " and ap.dataVencimento >= '"+ req.body.dtIni + " '"
        }
        if (req.body.dtEnd ){
            userQuery += " and ap.dataVencimento <= '"+ req.body.dtEnd + " '"
        }
        return querySql(userQuery, '')
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }
   });
});

router.post("/paymentsLate", function (req, res) {
    return db.Hash(req.headers.authorization)
      .then(function (valid) {
        if (valid.length == 0) {
          res.status(500).json('unauthorized');
        }
        else {
          var userQuery = "select c.nameCliente, a.Total, ap.valorParcela, DATEDIFF(SYSDATE(), ap.dataVencimento ) as  'late',"
          userQuery += " ap.valorParcela + (DATEDIFF(SYSDATE(), ap.dataVencimento ) * 20) as  'vlrLate',  ap.dataVencimento,  ap.dataPagamento,  "
          userQuery += "  (select v.nomeVendor from Vendor v where  v.idVendor = a.idVendor) as nomeVendor "
          userQuery += " from Cliente c  inner join Abaco a on a.idCliente = c.idCliente "
          userQuery += " inner join AbacoParc ap on ap.idAbaco = a.idAbaco "
          userQuery += " where ap.dataVencimento < SYSDATE() and ap.dataPagamento = '0000-00-00' " 
          if (req.body.name ){
              userQuery += " and UPPER(c.nameCliente) like UPPER('%"+req.body.name+"%')"
          }
          if (req.body.dtIni ){
              userQuery += " and ap.dataVencimento >= '"+ req.body.dtIni + " '"
          }
          if (req.body.dtEnd ){
              userQuery += " and ap.dataVencimento <= '"+ req.body.dtEnd + " '"
          }
          return querySql(userQuery, '')
            .then(function (rows) {
              res.status(200).json({ rows });
            });
        }
     });
  });
  
  router.post("/report/vendor", function (req, res) {
    return db.Hash(req.headers.authorization)
      .then(function (valid) {
        if (valid.length == 0) {
          res.status(500).json('unauthorized');
        }
        else {
          var userQuery = "select v.nomeVendor, v.apelidoVendor, c.nameCliente, a.Total, a.dataOperacao "
          userQuery += " from Cliente c inner join Abaco a on a.idCliente = c.idCliente "
          userQuery += " inner join Vendor v on v.idVendor = a.idVendor "
          userQuery += " where 1 = 1 " 
          if (req.body.name ){
              userQuery += " and ( UPPER(v.nomeVendor) like UPPER('%"+req.body.name+"%') or  UPPER(v.apelidoVendor) like UPPER('%"+req.body.name+"%') )"
          }
          if (req.body.dtIni ){
              userQuery += " and a.dataOperacao >= '"+ req.body.dtIni + " '"
          }
          if (req.body.dtEnd ){
              userQuery += " and a.dataOperacao <= '"+ req.body.dtEnd + " '"
          }
          return querySql(userQuery, '')
            .then(function (rows) {
              res.status(200).json({ rows });
            });
        }
     });
  });

  router.post("/report/abaco", function (req, res) {
    return db.Hash(req.headers.authorization)
      .then(function (valid) {
        if (valid.length == 0) {
          res.status(500).json('unauthorized');
        }
        else {
          var userQuery = "select a.idAbaco, v.nomeVendor, v.apelidoVendor, c.nameCliente, a.Total, a.dataOperacao,  "
          userQuery += " (select sum(ap.valorPago) from AbacoParc ap where ap.idAbaco = a.idAbaco) vlrPago "
          userQuery += " from Cliente c inner join Abaco a on a.idCliente = c.idCliente  "
          userQuery += " left join Vendor v on v.idVendor = a.idVendor "
          userQuery += " where 1 = 1 " 
          if (req.body.name ){
              userQuery += " and  UPPER( c.nameCliente) like UPPER('%"+req.body.name+"%') "
          }
          if (req.body.dtIni ){
              userQuery += " and a.dataOperacao >= '"+ req.body.dtIni + " '"
          }
          if (req.body.dtEnd ){
              userQuery += " and a.dataOperacao <= '"+ req.body.dtEnd + " '"
          }
          return querySql(userQuery, '')
            .then(function (rows) {
              res.status(200).json({ rows });
            });
        }
     });
  });

module.exports = router;