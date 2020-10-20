//관례적으로 express main은 app.js로 이름을 짓는다. 
// 뭘로 지어도 상관없지만 약속처럼 사용하는듯..

const express = require('express');
const app = express();

// pug가 기본으로 들여쓰기가 안돼있는데 가능하게 해줌 
app.locals.pretty = true;

app.set('views', './views');
app.set('view engine', 'pug');

//public이라는 directory를 정적인 파일이 있는 위치로 하겠다는 뜻.
app.use(express.static('public'));
app.get('/template', function(request, response){
    response.render('temp', {
        time : Date(),
        _title : 'Pug'
    });
});
//get이 하는일을 라우터라고한다.(길을 찾는다는 뜻)
app.get('/', function(request, response){
    response.send('Hello World!');
});

app.get('/dynamic', function(request, response){
    var lis = '';
    for(var i = 0; i<5; i++){
        lis = lis + '<li>coding</li>'
    }
    var time = Date();
    var output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        Hello, Dynamic!!
        <ul>
        ${lis}
        </ul>
        ${time}
    </body>
    </html>`;
    response.send(output);
});

app.get('/route', function(request, response){
    response.send('Hello Router, <img src="/4.jpg">' )
});

app.get('/login', function(request, response){
    response.send('<h1>Login please</h1>');
});

app.listen(3000, function(){
    console.log('Connected 3000 port!');
});