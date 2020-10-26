//관례적으로 express main은 app.js로 이름을 짓는다. 
// 뭘로 지어도 상관없지만 약속처럼 사용하는듯..

const express = require('express');
const app = express();

// pug가 기본으로 들여쓰기가 안돼있는데 가능하게 해줌 
app.locals.pretty = true;

app.set('views', './views');
app.set('view engine', 'pug');

//post 방식으로 보낼때 body를 읽지못함.. 그래서 아래 문법으로 설정해줘야함.
//예전엔 body-parser 라는 npm 모듈을 사용한듯한데 지금은 아래 방법을 사용하는듯함.
//express 자체에 포함된듯.. body-parser 모듈이..
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//public이라는 directory를 정적인 파일이 있는 위치로 하겠다는 뜻.
app.use(express.static('public'));
app.get('/form', function(request, response){
    response.render('form');
});

app.get('/form_receiver', function(request, response){
    var title = request.query.title;
    var description = request.query.description;
    response.send(title+','+description);
});

app.post('/form_receiver', function(request, response){
    var title = request.body.title;
    var description = request.body.description;
    response.send(title + ',' + description);
});

app.get('/topic/:id', function(request, response){
    var topics = [
        'Javascript is.....',
        'Nodejs is...',
        'Express is...'
    ];
    var output = `
        <a href ="/topic/0">Javascript</a><br>
        <a href ="/topic/1">Nodejs</a><br>
        <a href ="/topic/2">Express</a><br><br>
        ${topics[request.params.id]}
    `;
    response.send(output);
});

app.get('/topic/:id/:mode', function(request, response){
    response.send(request.params.id + ', ' + request.params.mode);
});

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