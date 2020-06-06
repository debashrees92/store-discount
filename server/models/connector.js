const pool = require('./dbconnection');
const jwt = require('jsonwebtoken');

var resultsNotFound = {
  "errorCode": "0",
  "errorMessage": "Operation not successful.",
  "rowCount": "0",
  "data": ""
};
var resultsFound = {
  "errorCode": "1",
  "successMessage": "Operation successful.",
  "rowCount": "1",
  "data": ""
};

module.exports = {
  signIn: function (req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
        var sql = 'select * from user where `UserName` = ?';
        //console.log("form bodyyyy----"+req.body.emailId);
        var values = [req.body.UserName];
        connection.query(sql, values, function (error, results, fields) {
          if (error) {
            console.log(error);
            resultsNotFound["errorMessage"] = "Query error";
            return res.send(resultsNotFound);
          } 
          if (results =="") {
            resultsNotFound["errorMessage"] = "User Id not found.";
            return res.send(resultsNotFound);
          }
          //console.log("form bodyyyy----"+results[0].password);
          if (req.body.Password === results[0].Password) {
            var token = {
              "token": jwt.sign(
                { UserName: req.body.UserName },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
              )
            }
            resultsFound["data"] = token;
            res.send(resultsFound);
          } else {
            resultsNotFound["errorMessage"] = "Incorrect Credentials.";
            return res.send(resultsNotFound);
          }      
          // When done with the connection, release it.
          connection.release(); // Handle error after the release.
          if (error) throw error; // Don't use the connection here, it has been returned to the pool.
        });
    });
  },
  getUser: function (input, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

        var sql = 'SELECT `UserName`,`UserType`,`AddedDate` FROM `user` WHERE `UserName` = ?';
        var values = [input]
        // Use the connection
        connection.query(sql, values, function (error, results, fields) {
          if (error) {
            resultsNotFound["errorMessage"] = "Something went wrong with Server.";
            return res.send(resultsNotFound);
          }
          if (results =="") {
            resultsNotFound["errorMessage"] = "User Id not found.";
            return res.send(resultsNotFound);
          }
          resultsFound["data"] = results[0];
          res.send(resultsFound);
          // When done with the connection, release it.
          connection.release(); // Handle error after the release.
          if (error) throw error; // Don't use the connection here, it has been returned to the pool.
        });
      });
  },
  getProductData: function (input, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
        var sql = 'SELECT * FROM `Product`';
        var values = []
        // Use the connection
        connection.query(sql, values, function (error, results, fields) {
          if (error) {
            resultsNotFound["errorMessage"] = "Something went wrong with Server.";
            return res.send(resultsNotFound);
          }
          if (results =="") {
            resultsNotFound["errorMessage"] = "Data not found.";
            return res.send(resultsNotFound);
          }
          console.log("product-------"+results);
          resultsFound["data"] = results;
          res.send(resultsFound);
          // When done with the connection, release it.
          connection.release(); // Handle error after the release.
          if (error) throw error; // Don't use the connection here, it has been returned to the pool.
        });
      });
  }
};