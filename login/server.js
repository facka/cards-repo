var express = require('express');
var app = express();
var server = require('http').createServer(app);
server.listen(8000);
var io = require('socket.io').listen(server);

//LOGIN REQUIRES
passport = require("passport");
LocalStrategy = require('passport-local').Strategy;
FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');
var mongoose = require('mongoose');
var flash = require("connect-flash");
var hash = require("./pass").hash;
var ObjectID = require("../node_modules/mongoose/node_modules/mongodb").ObjectID;

mongoose.connect("mongodb://localhost/myapp");

// Local Users Schema
var localUserSchema = new mongoose.Schema({
	username: String,
	salt: String,
	hash: String
});
var Users = mongoose.model('userauths', localUserSchema);

//Facebook Users Schema 
var facebookUserSchema = new mongoose.Schema({
    fbId: String,
    email: { type : String , lowercase : true},
    name : String
});
var fbUsers = mongoose.model('fbs',facebookUserSchema);

/*
* Configuration and Middlewares
*/

passport.use(new LocalStrategy(function(username, password,done){
	Users.findOne({ username : username},function(err,user){
        emitLog("LocalStrategy = "+LocalStrategy);
		emitLog("user = "+user);
		if(err) { return done(err); }
        if(!user){
			emitLog("done() = "+done);			
            return done(null, false, { message: 'Incorrect username.' });
        }

        hash( password, user.salt, function (err, hash) {
            if (err) { return done(err); }
            if (hash == user.hash) return done(null, user);
            done(null, false, { message: 'Incorrect password.' });
        });
    });
}));

passport.use(new FacebookStrategy({
    clientID: "92788592057",
    clientSecret: "d4127d1b8975474b181bfba690748882",
    callbackURL: "http://localhost:8000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    fbUsers.findOne({fbId : profile.id}, function(err, oldUser){
        if(oldUser){
            done(null,oldUser);
        }else{
            var newUser = new FbUsers({
                fbId : profile.id ,
                email : profile.emails[0].value,
                name : profile.displayName
            }).save(function(err,newUser){
                if(err) throw err;
                done(null, newUser);
            });
        }
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    fbUsers.findById(id,function(err,user){
        if(err) done(err);
        if(user){
            done(null,user);
        }else{
            Users.findById(id, function(err,user){
                if(err) done(err);
                done(null,user);
            });
        }
    });
});

app.configure(function () {
    app.set('port', process.env.PORT || 8000);
	app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.methodOverride());
    app.use(flash());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});
  
/*
* Error Handling
*/
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('500', { error: err });
});

/*
* Helpers
*/
function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

function userExist(req, res, next) {
    Users.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            res.redirect("/singup");
        }
    });
}

/*
* Routes
*/

app.get("/", function(req, res){ 
    if(req.isAuthenticated()){
	  emitLog("req.isAutenticated() = "+req.isAuthenticated);			
	  emitLog("Checking if it is logged, User = "+req.user.username);	
      res.render("loggedin", { user : req.user}); 
    }else{
        res.render("loggedin", { user : null});
    }    
});

app.get("/login", function(req, res){ 
	emitLog("Request: "+req);	
    res.render("login");
});

app.post("/login" 
    ,passport.authenticate('local',{
        successRedirect : "/",
        failureRedirect : "/login",
    }) 
);

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", userExist, function (req, res, next) {
    var user = new Users();
    hash(req.body.password, function (err, salt, hash) {
        if (err) throw err;
        var user = new Users({
            username: req.body.username,
            salt: salt,
            hash: hash,
            _id : new ObjectID
        }).save(function (err, newUser) {
            if (err) throw err;
            req.login(newUser, function(err) {
              if (err) { return next(err); }
              return res.redirect('/');
            });
        });
    });
});

app.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));

app.get("/auth/facebook/callback", 
    passport.authenticate("facebook",{ failureRedirect: '/login'}),
    function(req,res){
        res.render("loggedin", {user : req.user});
    }
);

app.get("/profile", authenticatedOrNot, function(req, res){ 
    res.render("profile", { user : req.user});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
  
  
var fs = require('fs');

var response404 = function(res) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("Error 404: File not found!");
};

app.get("/page/:which", function(req, res) {
	var file = __dirname + '/'+req.params.which;
    fs.exists(file,function(exists){
		if (exists) {
			res.sendfile(file);
		}
		else {
			response404(res);
		}
	});  
});

/*app.get("*", function(req, res) {
	response404(res);
});*/

io.set('heartbeat interval', 10); //cambie este valor de 20 a 10 para que ande mas rapido.
io.set('heartbeat timeout', 60); 
io.set('transports',[ 'xhr-polling' ]);

var consoleSocket;
var emitLog = function(message) {
	if (consoleSocket) {
		consoleSocket.emit("log",message);
	}
};

app.get('/console.html', function(req, res){
  io.sockets.on('connection', function (socket) {
    console.log("Se conecto el cliente de id = "+socket.id);
	consoleSocket = socket;
  });

  io.sockets.on('disconnect', function (socket) {
	console.log("socket.id : "+socket.id);
  });
  
  res.sendfile(__dirname + "/views/console.html");
});


io.set('heartbeat interval', 10); //cambie este valor de 20 a 10 para que ande mas rapido.
io.set('heartbeat timeout', 60); 
io.set('transports',[ 'xhr-polling' ]);

io.sockets.on('connection', function (socket) {
  console.log("Se conecto el cliente de id = "+socket.id);
  //Hay que verificar si el cliente ya existia 
  
});

io.sockets.on('disconnect', function (socket) {
	console.log("socket.id : "+socket.id);
	socket.emit("message",socket.id+ "logged out");	
	socket.broadcast.emit("message",socket.id+ "logged out");	
});