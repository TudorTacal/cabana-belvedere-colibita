require('dotenv').config()
var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var xoauth2 = require('xoauth2');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index');
});

app.get('/about', function(request, response){
  response.render('about');
});

app.get('/rooms', function(request, response){
  response.render('room');
});

app.get('/contact', function(request, response){
  response.render('contact');
});

app.post('/contact', jsonParser, function (req, res) {
  var mailOpts, smtpTrans;

  smtpTrans = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      }
  });

  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: 'tudortacal@gmail.com',
    subject: 'Mail from your Cabana Belvedere',
    text: "From: " + req.body.name + " "+ req.body.email + '\n\n' + req.body.message
  };

  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      console.log(error);
      console.log('Not sent');
      console.log(process.env.EMAIL);
    }
    else {
      console.log('sent');
    }
  });

  // verify connection configuration
  smtpTrans.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
