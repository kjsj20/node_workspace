/*기존의 http 모듈로만으로 구축했던 서버에는 기능상 부족한 점이 많다.. 
문제점1) 이미지와 같은 정적파일에 대한 요청 처리가 미비
해결책) http 모듈은 아주 기본적인 서버구축 모듈이므로,
            이보다 기능을 보강한 모듈로 확장해 보자!!
            
            http > connect모듈 (http보완) > express모듈(connect보완)
*/

var http = require("http");
var fs = require("fs");
var express = require("express"); 
var static = require("serve-static"); //정적 자원 처리 하는 모듈
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

// 요청, 응답을 use() 메서드로 처리해야 한다..
app.use(function(request, response){
});

var server = http.createServer(app);

server.listen(8888, function(){
    console.log("The Server is running at 8888 port...");
});