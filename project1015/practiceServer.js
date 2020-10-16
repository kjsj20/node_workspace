var http = require("http");
var mysql = require("mysql");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var ejs = require("ejs");
var con;

var server = http.createServer(function (request, response) {
    urlJson = url.parse(request.url, true);

    if (urlJson.pathname === "/category") {
        category(request, response);
    }
});

function category(request, response) {
    var sql = "select * from category";

    con.query(sql, function (queryErr, record, fields) {
        if (queryErr) {
            console.log("")
        } else {
            fs.readFile("./animal.ejs", "utf8", function (readErr, data) {
                if (readErr) {
                    console.log("animal.ejs 호출에 실패 했습니다.");
                } else {
                    response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        categoryArray : record,
                    }));
                }
            });
        }
    });
}

function animal(id){
    console.log("나호출했엉?");
}

function connectDB() {
    con = mysql.createConnection(
        {url: "localhost", user: "root", password: "1234", database: "node"}
    );
}

server.listen(9999, function () {
    console.log("Server Start");
    connectDB();
});