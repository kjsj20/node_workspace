var mysql = require("mysql");
const { values } = require("underscore");
var conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "1234",
    database : "o2"
});

conn.connect();

/*
var sql = "SELECT * FROM TOPIC";
conn.query(sql, (err, rows, fields) =>{
    if(err){
        console.log(err);
    } else {
        for(var i=0; i<rows.length; i++){
            console.log(rows[i].author);
        }
    }
});
*/

/*
var sql = 'insert into topic (title, description, author) values(?,?,?)';
var params = ['Supervisor', 'Watcher', 'graphittie'];
conn.query(sql, params,(err, rows, fields) => {
    if(err){
        console.log(err);
    } else {
        console.log(rows.insertId);
    }
});
*/

/*
var sql = 'update topic set title = ?, author = ? where id = ?';
var params = ['NPM', 'leezche', 1];
conn.query(sql, params,(err, rows, fields) => {
    if(err){
        console.log(err);
    } else {
        console.log(rows);
    }
});
*/

var sql = 'delete from topic where id = ?';
var params = [1];
conn.query(sql, params,(err, rows, fields) => {
    if(err){
        console.log(err);
    } else {
        console.log(rows);
    }
});

conn.end();