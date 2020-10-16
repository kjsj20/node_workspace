/*기존의 http 모듈로만으로 구축했던 서버에는 기능상 부족한 점이 많다.. 
문제점1) 이미지와 같은 정적파일에 대한 요청 처리가 미비
해결책) http 모듈은 아주 기본적인 서버구축 모듈이므로,
            이보다 기능을 보강한 모듈로 확장해 보자!!
            
            http > connect모듈 (http보완) > express모듈(connect보완)
*/

var http = require("http");
var ejs = require("ejs");
var fs = require("fs");
var express = require("express"); 
var static = require("serve-static"); //정적 자원 처리 하는 모듈
var mysql = require("mysql");
var common = require("./common.js");
const e = require("express");
let conStr={
    url:"localhost",
    user:"root",
    password:"1234",
    database:"node"
};
let con;
//express 모듈은 미들웨어라 불리는 함수를 이용하여 기존에 http 모듈로는
//할 수 없었던 추가된 기능들을 지원한다...(express 필수라고 보아야 한다)
// 참고로 미들웨어는 express 객체의 use() 메서드로 지정할 수 있다..
// 사용 예) app.use(사용할 미들웨어);
// 오늘 사용할 미들웨어는 static 미들웨어이다..
// static은 '정적인' 의 의미로서, 전산분야에서 정적이라는 뜻은, 프로그래밍 언어
// 처럼 실행시 변경이 가능한 것이 아니라, 고정되어 있는 형태를 의미
// html , images, css파일 프로그래밍 언어가 아니기에, 실행타임에 변경이 불가..
// 그래서 자바스크립트와 같은 프로그래밍 언어가 정적으로 제어하기 위해 등장...
var app = express(); //express 객체 생성
// __dirname, __filename (현재 실행중인 node.js 파일의 경로를 반환해줌)
// console.log("현재 실행중인 파일의 디렉토리 경로 : ", __dirname)
app.use(static(__dirname+"/static")); //정적자원의 위치를 등록!!!

// form양식으로 전송될때 처리.
app.use(express.urlencoded({
    extended:true
}));


// 요청, 응답을 use() 메서드로 처리해야 한다..
// post(매개변수1, 매개변수2) 메서드 매겨변수가 2개
// 매개변수1: 유형1
app.post("/notice/regist",function(request, response){
    // response.end("Your http method is post");
    var title = request.body.title;
    var writer = request.body.writer;
    var content = request.body.content;

    console.log("당신이 보낸 제목은", title);
    console.log("당신이 보낸 작성자는", writer);
    console.log("당신이 보낸 내용은", content);

    var sql = "insert into notice(title,writer,content) values(?,?,?)";

    con.query(sql,[title, writer, content],function(qErr, fields){
        if(qErr){
            console.log("등록 실패.", qErr);
        } else {
            response.writeHead(200,{"Content-type":"text/html;charset=utf-8"});
            response.end(common.getMsgURL("등록성공", "/notice/list"));
        }
    });
});

app.get("/notice/list", function(request,response){
    var sql = "select * from notice order by notice_id desc"

    con.query(sql, function(qErr, record, fields){
        if(qErr){
            console.log("게시판 리스트 조회 실패", qErr);
        } else {
            fs.readFile("./list.ejs", "utf-8",function(err,data){
                if(err){
                    console.log("게시판 리스트 읽기 실패!", err);
                } else {
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        noticeArray: record
                    }));
                }
            });
        }
    });
});

// 한건 가져오기
app.get("/notice/detail", function(request, response){
    //get방식의 파라미터 받기!!
    var notice_id = request.query.notice_id;
    var sql = "select * from notice where notice_id = ?";
    con.query(sql, [notice_id], function(qErr, record, fields){
        if(qErr){
            console.log("조회실패.",qErr);
        } else {
            fs.readFile("./detail.ejs", "utf-8", function(err, data){
                if(err){
                    console.log("detail.ejs reading error", err);
                } else {
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        notice:record[0]
                    }));
                }
            });
        }
    });
    // response.end(sql);
});

// 한건 삭제하기
app.post("/notice/del", function(request, response){
    // 파라미터 받기 (post방식)
    var notice_id = request.body.notice_id
    var sql = "delete from notice where notice_id = ?";

    con.query(sql, [notice_id], function(qErr, fields){
        if(qErr){
            console.log("삭제 실패..", qErr);
        } else {
            response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
            response.end(common.getMsgURL("삭제성공!", "/notice/list"));
        }
    });
});

// 한건 업데이트 하기
app.post("/notice/edit", function(request, response){
    notice_id = request.body.notice_id
    title = request.body.title;
    writer = request.body.writer;
    content = request.body.content;
    sql = "update notice set title=?, writer=?, content=? where notice_id = ?"

    con.query(sql, [title,writer,content,notice_id], function(qErr,fields){
        if(qErr){
            console.log("수정 실패 ...", qErr);
        } else {
            response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
            response.end(common.getMsgURL("수정 성공", "/notice/detail?notice_id="+notice_id));
        }
    });
});

// 데이터베이스 접속
function connect(){
    con = mysql.createConnection(conStr);
}

var server = http.createServer(app);

server.listen(8888, function(){
    console.log("The Server is running at 8888 port...");
    connect();
});