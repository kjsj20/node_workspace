var express = require('express');
var fs = require('fs');

//mysql 접속.
var mysql = require("mysql");
var conn = mysql.createConnection(
    {host: "localhost", user: "root", password: "1234", database: "o2"}
);

conn.connect();

var app = express();
app.locals.pretty = true;
app.set('views', './views_mysql');
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/topic/add', function (req, res) {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, (err, topics, fiedls) => {
        if (err) {
            console.log(err);
            res
                .status(500)
                .send('Internal Server Error');
        }

        res.render('add', {topics: topics});
    });
});

app.post('/topic/add', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = "INSERT INTO topic (title, description, author) VALUES(?, ?, ?)"
    conn.query(sql, [title, description, author], (err, result, fields) => {
        if (err) {
            console.log(err);
            res
                .status(500)
                .send('Internal Server Error');
        }
        res.redirect('/topic/'+result.insertId);
    });  
});

app.get([
     '/topic/:id/edit'
], function (req, res) {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, (err, topics, fiedls) => {
        var id = req.params.id;
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id = ?';
            conn.query(sql, [id], (err, topic, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('edit', {
                        topics: topics,
                        topic: topic[0]
                    });
                }
            })
        } else {
            console.log("there is no id.");
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/topic/:id/edit', function(req, res){
    var title = req.body.title;
    var descritpion = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'update topic set title=?, description=?, author=? where id =?'
    conn.query(sql, [title, descritpion, author, id], function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else{
            res.redirect('/topic/'+id);
        }
    });
});

app.get('/topic/:id/delete', function(req, res){
    var sql = 'SELECT id,title FROM topic';
    var id = req.params.id;
    conn.query(sql, (err, topics, fiedls) => {
        var sql = 'select * from topic where id = ?';
        conn.query(sql, [id], function(err, topic){
            if(err){
                console.log(err);
                res.status(500),send('Internal SErver Error');
            } else {
                if(topic.length === 0){
                    console.log("There is no record.");
                    res.status(500),send('Internal SErver Error');
                } else {
                    res.render('delete', {topics:topics, topic: topic[0]});
                }
            }
        });  
    });
});

app.post('/topic/:id/delete', function(req, res){
    var id = req.params.id;
    var sql = 'delete from topic where id = ?';
    conn.query(sql, [id], function(err, result){
        res.redirect('/topic');
    });
});

app.get([
    '/topic', '/topic/:id'
], function (req, res) {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, (err, topics, fiedls) => {
        var id = req.params.id;
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id = ?';
            conn.query(sql, [id], (err, topic, fields) => {
                if (err) {
                    console.log(err);
                    res
                        .status(500)
                        .send('Internal Server Error');
                } else {
                    res.render('view', {
                        topics: topics,
                        topic: topic[0]
                    });
                }
            })
        } else {
            res.render('view', {topics: topics});
        }
    });
});


//포트번호를 지정하고 불러옴
app.listen(3000, function () {
    console.log("Connected, 3000 port!!!!");
});