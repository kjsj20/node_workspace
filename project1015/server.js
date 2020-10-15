var http = require("http");
var url = require("url");
var fs = require("fs");
var mysql = require("mysql");
var ejs = require("ejs");
var qs = require("querystring"); 
var urlJson;
const { RSA_NO_PADDING } = require("constants");
let con;

var server = http.createServer(function(request, response){
    //요청 구분 
    urlJson = url.parse(request.url, true);
    //console.log("urlJson : ", urlJson);

    if(urlJson.pathname=="/"){//메인을 요청하면..
        fs.readFile("./index.html","utf-8", function(error, data){
            if(error){
                console.log("index.html 읽기실패", error);
            }else{
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(data);
            }
        })
    }else if(urlJson.pathname=="/member/registForm"){//가입폼을  요청하면...
        registForm(request, response);
    }else if(urlJson.pathname=="/member/regist"){//가입을 요청하면..
        regist(request, response);
    }else if(urlJson.pathname=="/member/loginForm"){//로그인 폼을 요청하면...
               
    }else if(urlJson.pathname=="/member/list"){//회원 목록을 요청하면..
        getList(request, response);
    }else if(urlJson.pathname=="/member/detail"){//회원 정보 보기를 요청하면..
        getDetail(request, response);
    }

});

//데이터 베이스 연동인 경우엔 함수로 별도로 정의 
function registForm(request, response){
    //회원가입폼은 디자인을 표현하기 위한 파일이므로, 기존에는 html로 충분했으나...
    //보유기술은 DB의 데이터를 가져와서 반영해야 하므로, ejs 로 처리해야 한다...
    var sql="select * from skill";
    con.query(sql, function(error, record, fields){
        if(error){
            console.log("skill 조회실패", error);
        }else{
            console.log("skill record : ", record);
            //registForm.ejs에게 json배열을 전달하자
            fs.readFile("./registForm.ejs","utf-8", function(error, data){
                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(ejs.render(data, {
                    skillArray:record
                }));
            });
        }
    });

}

//회원등록 처리 
function regist(request, response){
    //post방식으로 전송된, 파라미터받기!! 
    request.on("data", function(param){
        //url모듈에게 파싱을 처리하게 하지 말고, querystring 모듈로 처리한다 
        //console.log("post param :", new String(param).toString());
        var postParam = qs.parse(new String(param).toString());
        console.log("postParam : ", postParam);

        var sql="insert into member2(uid,password,uname,phone,email,receive,addr,memo)";
        sql+=" values(?,?,?,?,?,?,?,?)"; //물음표를 바인드 변수라 한다

        con.query(sql,[ 
               postParam.uid,
               postParam.password,
               postParam.uname,
               postParam.phone,
               postParam.email,
               postParam.receive,
               postParam.addr,
               postParam.memo
            ], function(error, fields){
                if(error){
                    console.log("등록실패",error);
                }else{
                    //목록페이지 보여주기
                    //등록되었음을 alert()으로 알려주고, /member/list 로 재접속 
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    var tag="<script>";
                    tag+="alert('등록성공');";
                    tag+="location.href='/member/list';"; // <a> 태그와 동일한 효과
                    tag+="</script>";

                    response.end(tag);   
                }
        } );
    });
}

//회원목록 처리함수 
function getList(request, response){
    // 회원 목록 가져오기
    var sql = "select * from member2";
    con.query(sql, function(error, record, fields){
        if(error){
            console.log("조회 실패", error);
        } else {
            fs.readFile("./list.ejs", "utf-8", function(error, data){
                if(error){
                    console.log("list.ejs 읽기실패", error);
                }else{
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        memberArray: record
                    }));            
                }
            });
        }
    });
}

// 회원 상세보기 처리 함수
function getDetail(request,response){
    // console.log("urlJson : ", urlJson.query);
    var member2_id = urlJson.query.member2_id;
    var sql = "select * from member2 where member2_id =" + member2_id;
    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    response.end(sql);
    // con.query(sql, function(error, record, fields){

    // });
}

//mysql 접속 
function connect(){
    con=mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}

server.listen(7788, function(){
    console.log("Server is running at 7788 port...");
    connect();
});