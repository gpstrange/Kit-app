var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose	= require("mongoose"),
	ejs          = require("ejs"),
    firebase      = require("firebase"),
    flash          = require('connect-flash'),
    passport        = require("passport"),
    passportLocal    = require("passport-local"),
    session            = require("express-session"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/kit");
var app = express();
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

app.use(require("express-session")({
    secret: "Guru did the app!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});



app.use((req, res, next)=>{
   res.locals.currentUser = req.user;
   next();
});

var config = {
  apiKey: "AIzaSyDaZrNpHcu4BV-q461etow-owR5BSwbj0U",
  authDomain: "neruppu-daw.firebaseapp.com",
  databaseURL:"https://neruppu-daw.firebaseio.com/",
  storageBucket: "gs://neruppu-daw.appspot.com/",
};
firebase.initializeApp(config);

var studentsSchema = new mongoose.Schema({
    name:String,
    address:String,
    Email:String,
    regNo:String,
    dept:String,
    dob:String,
    mobile:String,
    password: String,
    username:String,
    cv : String
});
studentsSchema.plugin(passportLocalMongoose);

var students = mongoose.model('students',studentsSchema);

var userSchema =  new mongoose.Schema({
    username: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);

var user = mongoose.model("user",userSchema);

passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get('/', (req,res)=>{
    res.render('index');
})

app.get('/students', (req,res)=>{
    res.render('students');
})

app.post('/students',(req,res)=>{
    var name = req.body.name,
        address = req.body.address,
        mobile = req.body.mobile,
        dob = req.body.dob,
        email = req.body.email,
        regNo = req.body.regNo,
        cv = req.body.cv,
        dept = req.body.dept,
        username = req.body.username,
        password = req.body.pwd ;

        firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
          firebase.database().ref('users/' ).push({
            name: name,
            email: email,
            cv : cv,
            regNo : regNo,
            address : address,
            dept : dept,
            username : username,
            mobile : mobile,
            dob : dob
          }).then(()=>{
               var student = {
                    name:name,
                    address:address,
                    Email:email,
                    regNo:regNo,
                    dept:dept,
                    dob:dob,
                    mobile:mobile,
                    username:username,
                    cv:cv
                }
                var newUser = new user({username: email});
                user.register(newUser, password, (err, user)=>{
                    if(err){
                        console.log(err);
                        return res.render("students");
                    }
                       students.create(student , (err,created)=>{
                           if(err){
                               console.log(err);
                               req.flash('error', 'Could not update , please try again');
                               res.render('students') 
                           }
                           console.log(student)
                                res.render("home",{ name:name,
                                                    address:address,
                                                    Email:email,
                                                    regNo:regNo,
                                                    dept:dept,
                                                    dob:dob,
                                                    mobile:mobile,
                                                    username:username,
                                                    cv:cv             }); 
                    });
                })
          }).catch(()=>{
              console.log("Data is not stored on mongodb"+error)
          })
        })
        .catch(function(error) {
          console.log(error)
          req.flash('error', 'Could not update , please try again');
            res.render('students')
        });   
})
//
//app.get('/staffs', (req,res)=>{
//    res.render('staffs');
//})
//
//app.post('/staffs',(req,res)=>{
//    var schoolName = req.body.schoolName,
//        address = req.body.address,
//        Email = req.body.Email,
//        position = req.body.position,
//        userName = req.body.userName,
//        pwd = req.body.pwd;
//    
//    var school = {
//        schoolName:schoolName,
//        address:address,
//        Email:Email,
//        position:position,
//        userName:userName,
//        pwd : pwd
//    }
//    schools.create(school,(err,newUser)=>{
//        if(err){
//            console.log(err);
//        }
//        console.log(school);
//    });
//})

app.post('/login',(req,res)=>{
    var email=req.body.username,
        password=req.body.pwd;  
    firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
        res.redirect('/home')
    }).catch(()=>{
        console.log('Error')
        res.redirect('/');
    })
})

app.get('/home',(req,res)=>{
    
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            var user = firebase.auth().currentUser;
            var emailVerify = user.email;
                MongoClient.connect('mongodb://localhost/kit' , (err, db)=>{
                    db.collection('students', function (err, collection) {
                        collection.find().toArray(function(err, items) {
                        if(err) throw err; 
                        var j =items.length;
                        for(var i=0; i<j ; i++){
                           if(items[i].Email == emailVerify){
                             var item = items[i];
                             console.log(item)
                             res.render('home',{item:item})
                         } 
                        }
                    })
                    })
                })
//                console.log(emailVerify)
//                res.render('home' , {   name:name,
//                                        address:address,
//                                        Email:email,
//                                        regNo:regNo,
//                                        dept:dept,
//                                        dob:dob,
//                                        mobile:mobile,
//                                        username:username, 
//                                        pic:pic     })
                }
            else{
                res.send(`<script>alert("You must be logged in")</script>`)
              }
            })

    })

app.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/')
})

//===============================================================================================================
//                                    BlueCard
//===============================================================================================================

app.get('/bluecard',(req,res)=>{
    res.render('bluecard');
})

var markSchema = new mongoose.Schema({
    name:String,
    regNo:Number,
    semester:Number,
    dept:String,
    sub1:Number,
    sub2:Number,
    sub3:Number,
    sub4:Number,
    sub5:Number,
    sub6:Number
});

var marks = mongoose.model('marks',markSchema);

app.post("/mark",(req,res)=>{
    
    var name=req.body.name,
        regNo=req.body.regNo,
        semester=req.body.sem,
        dept=req.body.dept,
        sub1=req.body.eceEnglish2 || req.body.eeeEnglish2 || req.body.cseEnglish2 || req.body.aeroEnglish2 || req.body.mechEnglish2,
        sub2=req.body.eceMaths2 || req.body.eeeMaths2 || req.body.cseMaths2 || req.body.aeroMaths2 || req.body.mechMaths2,
        sub3=req.body.ecePhysics2 || req.body.eeePhysics2 || req.body.csePhysics2 || req.body.aeroPhysics2 || req.body.mechPhysics2,
        sub4=req.body.eceChemistry2 || req.body.eeeChemistry2 || req.body.cseDpsd || req.body.aeroChemistry2 || req.body.mechChemistry2,
        sub5=req.body.eceCt || req.body.eeeCt || req.body.csePce || req.body.aeroEm || req.body.mechEm,
        sub6=req.body.eceEd || req.body.eeeBcme || req.body.csePuc || req.body.aeroBeee || req.body.mechBeee;
    
    var mark = {
        name:name,
        regNo:regNo, 
        semester:semester,
        dept:dept,
        sub1:sub1,
        sub2:sub2,
        sub3:sub3,
        sub4:sub4,
        sub5:sub5,
        sub6:sub6
    }   
    console.log(mark);
    marks.create(mark,(err,done)=>{
        if(err){
            console.log(err);
        }else{
            res.send(`<script>alert("Saved")</script>`);
        }
    });
})

app.post('/search',(req,res)=>{
    
    var person = req.body.search;
    
    MongoClient.connect("mongodb://localhost/kit", function (err, db) {
    
    db.collection('marks', function (err, collection) {
        
         collection.find().toArray(function(err, items) {
            if(err) throw err;    
             var j =items.length;
             for(var i=0;i<j;i++){
                    if(items[i].regNo == person){
                     var item = items[i];
                     res.render('student',{item:item})
                 }
                 else{  
                     x++;
                     if(x==j){
                      alert("Please enter a valid Register number");
                     res.send("Hii");
                    }}
             }
         });  
    });             
});   
})


app.listen(8084 , ()=>{
    console.log("started at 8084")
});