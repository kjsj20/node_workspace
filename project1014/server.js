/*웹 서버 구축하기*/
var http = require("http"); //http 내부 모듈 가져오기
var url = require("url"); //url 분석 모듈
var fs = require("fs"); //file system 모듈 (파일 일기, 쓰기)
var mysql = require("mysql"); //mysql 외부모듈

let conStr = {
    url: "localhost",
    user: "root",
    password: "1234",
    database: "node"
};

var con; //mysql 접속 정보를 가진 객체, 이 객체로 sql문을 수행할 수 있다.

// 서버 객체 생성
var server = http.createServer(function (request, response) {
    // 클라이언트가 원하는 요청을 처리하려면, URL을 분석을 하여 URI추출해서 조건을 따져보자
    var urlJson = url.parse(request.url, true);

    if (urlJson.pathname === "/") {
        fs.readFile("./index.html", "utf-8", function (error, data) {
            if (error) {
                console.log("index.html 읽기 실패", error);
            } else {
                response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                response.end(data);
            }
        });
    } else if (urlJson.pathname === "/member/registForm") {
        fs.readFile("./registForm.html", "utf-8", function (error, data) {
            if (error) {
                console.log("registForm.html 읽기 실패", error);
            } else {
                response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                response.end(data);
            }
        });
    } else if (urlJson.pathname === "/member/loginForm") {
        fs.readFile("./loginForm.html", "utf-8", function (error, data) {
            if (error) {
                console.log("loginForm.html 읽기 실패", error);
            } else {
                response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                response.end(data);
            }
        });
    } else if (urlJson.pathname === "/member/regist") {
        // 브라우저에서 전송된 파라미터를 먼저 받아야 한다.. get방식의 파라미터 받기 회원정보는 member2 테이블에 넣고

        var sql = "INSERT INTO MEMBER2(UID, PASSWORD, UNAME, PHONE, EMAIL, RECEIVE, ADDR, MEMO)";
        sql += "VALUES(?,?,?,?,?,?,?,?)";
        var param = urlJson.query;
        con.query(sql, [
            param.uid,
            param.password,
            param.uname,
            param.phone,
            param.email,
            param.receive,
            param.addr,
            param.memo
        ], function (error, result, fields) {
            if (error) {
                console.log("회원정보 insert 실패", error);
            } else {
                // 방금 insert 된 회원의 pk를 조회해보자
                sql = "select last_insert_id() as member2_id";
                con.query(sql, function (error, record, fields) {
                    if (error) {
                        console.log("pk가져오기 실패", error);
                    } else {
                        // console.log("record : ", record);
                        var member2_id = record[0].member2_id;
                        // 성공하면, 회원이 보유한 스킬 정보도 넣어주자 스킬 정보는 member_skill에 넣자 (배열의 길이만큼...)
                        for (i = 0; i < param.skill_id.length; i++) {
                            sql = "INSERT INTO MEMBER_SKILL(MEMBER2_ID, SKILL_ID) VALUES(" +
                                    member2_id + " ," + param.skill_id[i] + ")";
                            con.query(sql, function (err, result, fields) {
                                if (err) {
                                    console.log("스킬 등록 insert 실패", err);
                                } else {
                                    response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                                    response.end("회원정보 등록완료!");
                                }
                            });
                        }
                    }
                });
            }
        });
    } else if(urlJson.pathname === "/member/list"){
        // 회원목록 보여주기
        var sql = "select * from member2";
        con.query(sql, function(error, record, fields){
            console.log("회원목록 : ", record);
            //응답 정보를 테이블로 구성하여 출력
            var tag = "<table>";
            tag += "<tr>";
            tag += "<td>member2_id</td>";
            tag += "<td>uid</td>";
            tag += "<td>password</td>";
            tag += "<td>uname</td>";
            tag += "<td>phone</td>";
            tag += "<td>email</td>";
            tag += "<td>receive</td>";
            tag += "<td>addr</td>";
            tag += "<td>memo</td>";
            tag += "</tr>";
            tag += "</table>";

            for(i=0;){
                tag += "<tr>";
                tag += "<td>member2_id</td>";
                tag += "<td>uid</td>";
                tag += "<td>password</td>";
                tag += "<td>uname</td>";
                tag += "<td>phone</td>";
                tag += "<td>email</td>";
                tag += "<td>receive</td>";
                tag += "<td>addr</td>";
                tag += "<td>memo</td>";
                tag += "</tr>";
                tag += "</table>";
            }

            response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"};)
            response.end(tag);
        });

    }
});

// mysql 접속
function getConnection() {
    con = mysql.createConnection(conStr); //json을 매개변수로 넣어주면 됨
}

// 서버 가동
server.listen(7878, function () {
    console.log("My Server is running at 7878 port... ");
    getConnection();
});