/*
    프로그램 개발시 전반적으로 사용될 공통 기능을
    .js로 정의해놓자. 
    특히 node.js에서는 이러한 자바스크립트 라이브러리를 가리켜
    모듈이라 한다..
    [사용자 정의 모듈]
*/

// 메시지 출력후 URL재접속
exports.getMsgURL = function (msg, url){
    var tag = "<script>";
    tag += "alert('"+msg+"');";
    tag += "location.href = '" + url + "';";
    tag += "</script>";

    return tag;
}