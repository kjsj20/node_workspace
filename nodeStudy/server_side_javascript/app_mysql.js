var express = require('express');
var fs = require('fs');

//mysql 접속.
var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "1234",
    database : "o2"
});

conn.connect();

var app = express();
app.locals.pretty = true;
app.set('views', './views_mysql');
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/topic/new', function (req, res) {
    fs.readdir('data', function (err, files) {
        if (err) {
            console.log(err);
            res
                .status(500)
                .send('Internal Server Error');
        }

        res.render('new', {
            topics:files
        });
    });
});

app.get(['/topic', '/topic/:id'], function (req, res) {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, (err, topics, fiedls) => {
        res.render('view', {
            topics: topics
        });
    });
    /*fs.readdir('data', function (err, files) {
        if (err) {
            console.log(err);
            res
                .status(500)
                .send('Internal Server Error');
        }
        var id = req.params.id;
        if (id) {
            //id 값이 있을때
            fs.readFile('data/' + id, 'utf-8', function (err, data) {
                if (err) {
                    console.log(err);
                    res
                        .status(500)
                        .send('Internal Server Error');
                }

                res.render('view', {
                    topics: files,
                    title: id,
                    descirption: data
                });
            });
        } else {
            // id값이 없을때
            res.render('view', {
                topics: files,
                title: 'Welcome',
                descirption: 'Hello, JavaScript for Server'
            });
        }
    });*/
});

app.post('/topic', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/' + title, description, function (err) {
        if (err) {
            console.log(err);
            res
                .status(500)
                .send('Internal Server Error');
        }
        res.redirect('/topic/'+title);
    });
});

//포트번호를 지정하고 불러옴
app.listen(3000, function () {
    console.log("Connected, 3000 port!!!!");
});