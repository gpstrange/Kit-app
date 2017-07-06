var express   = require("express");
// 	bodyParser = require("body-parser"),
// 	mongoose	= require("mongoose"),
// 	ejs          = require("ejs"),
//     user           = require("./models/user"),
//     firebase        = require("firebase"),
// //    methodOverride    = require("method-override"),
//     flash             = require('connect-flash'),
//     passport           = require("passport"),
//     passportLocal       = require("passport-local"),
//     expressSession       = require("express-session"),
//     passportLocalMongoose = require("passport-local-mongoose");

// mongoose.connect(process.env.DATABASE_URL);
// mongoose.Promise = global.Promise;
var app = express();
// var MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 8000;

// app.use(bodyParser.urlencoded({extended: true}));
// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// app.use(require("express-session")({
//     secret: "Guru did the app!",
//     resave: false,
//     saveUninitialized: false
// }));

// var multer  = require('multer');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// const upload = multer({storage: storage})

// app.use(bodyParser.json());

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new passportLocal(user.authenticate()));
// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());

// app.use(flash());

// app.use(function(req, res, next){
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.errors = req.flash('error');
//     next();
// });

// var config = {
//   apiKey: "AIzaSyDaZrNpHcu4BV-q461etow-owR5BSwbj0U",
//   authDomain: "neruppu-daw.firebaseapp.com",
//   databaseURL:"https://neruppu-daw.firebaseio.com/",
//   storageBucket: "gs://neruppu-daw.appspot.com/",
// };
// firebase.initializeApp(config);

// var markSchema = new mongoose.Schema({
//     name:String,
//     regNo:Number,
//     semester:Number,
//     dept:String,
//     int:String,
//     sub1:Number,
//     sub2:Number,
//     sub3:Number,
//     sub4:Number,
//     sub5:Number,
//     sub6:Number
// });


// var studentsSchema = new mongoose.Schema({
//     name:String,
//     address:String,
//     Email:String,
//     regNo:String,
//     dept:String,
//     dob:String,
//     mobile:String,
//     bloodGroup:String,
//     community:String,
//     password: String,
//     username:String,
//     pic : String,
//     marks : [markSchema]
// });

// var students = mongoose.model('students',studentsSchema);

// app.use((req, res, next)=>{
//    res.locals.currentUser = req.user;
//    next();
// });

app.get('/', (req,res)=>{
    res.send('index');
})

// app.get('/students', (req,res)=>{
//     res.render('students');
// })

// app.post('/students',upload.single('pic'),(req,res)=>{
//         console.log(req.file)
//     var name = req.body.name,
//         address = req.body.address,
//         mobile = req.body.mobile,
//         dob = req.body.dob,
//         email = req.body.email,
//         regNo = req.body.regNo,
//         bloodGroup = req.body.bloodGroup,
//         community = req.body.community,
//         pic = req.file.originalname,
//         dept = req.body.dept,
//         username = req.body.username,
//         password = req.body.pwd ;

//         firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
//           var user = firebase.auth().currentUser,
//               userId = user.uid;
//           firebase.database().ref('users/' + userId ).set({
//             name: name,
//             email: email,
//             pic : pic,
//             regNo : regNo,
//             address : address,
//             dept : dept,
//             bloodGroup : bloodGroup,
//             community :community,
//             username : username,
//             mobile : mobile,
//             dob : dob
//           }).then(()=>{
//                var item = {
//                     name:name,
//                     address:address,
//                     Email:email,
//                     regNo:regNo,
//                     dept:dept,
//                     bloodGroup:bloodGroup,
//                     community:community,
//                     dob:dob,
//                     mobile:mobile,
//                     username:username,
//                     pic:pic
//                 }
//                  students.create(item , (err,created)=>{
//                            if(err){
//                                console.log(err);
//                                res.render('students',{error : 'Something went wrong'})
//                            }
//                            console.log(item)
//                             res.redirect("/home"); 

//                     });
              
//           }).catch(()=>{
//               console.log("Data is not stored on mongodb"+error)
//               res.render('students',{error : 'Something went wrong'})
//           })
//         })
//         .catch(function(error) {
//           console.log(error)
//             res.render('students',{error : 'Something went wrong'})
//         });   
// })

// app.get('/staffs', (req,res)=>{
//     res.render('stafflogin');
// })

// app.get('/register',(req,res)=>{
//      res.render("register"); 
// })

// app.get('/editprofile',(req,res)=>{
//      firebase.auth().onAuthStateChanged(function(user) {
//         if(user){
//             var user = firebase.auth().currentUser;
//             var emailVerify = user.email;
//                 MongoClient.connect('mongodb://localhost/kit' , (err, db)=>{
//                     db.collection('students', function (err, collection) {
//                         collection.find().toArray(function(err, items) {
//                         if(err) throw err; 
//                         var j =items.length;
//                         for(var i=0; i<j ; i++){
//                            if(items[i].Email == emailVerify){
//                              var item = items[i];
//                              res.render('editpagestudent',{item:item})
//                          } 
//                         }
//                     })
//                     })
//                 })
//                 }
//             else{
//                 res.render('index',{error : 'You must be logged in'})
//               }
//             })
// })

// app.post('/register',(req,res)=>{
//     var newUser = new user({username: req.body.username});
//     user.register(newUser, req.body.password, (err, user)=>{
//         if(err){
//             console.log(err);
//             return res.render("register");
//         }
//             passport.authenticate('local')(req,res,()=>{
//                 res.redirect("/staffpage"); 
//             }) 
           
//         });
//     });

// app.post('/stafflogin', passport.authenticate("local", 
//       {
//         successRedirect: "/staffpage",
//         failureRedirect: "/stafflog"
//     }),(req,res)=>{  
// })

// app.get('/stafflog',(req,res)=>{
//     res.render('stafflogin',{error:'Please check your user credentials'});
// })

// app.get('/staffpage',isLoggedIn,(req,res)=>{
//          res.render('staffpage')
//     })

// app.post('/login',(req,res)=>{
//     var email=req.body.username,
//         password=req.body.pwd;  
//     firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
//         res.redirect('/home')
//     }).catch(()=>{
//         console.log('Error')
//         res.render('index',{error:'Please check your user credentials'});
//     })
// })

// app.get('/home',(req,res)=>{
//     firebase.auth().onAuthStateChanged(function(user) {
//         if(user){
//             var user = firebase.auth().currentUser;
//             var emailVerify = user.email;
//                 MongoClient.connect('mongodb://localhost/kit' , (err, db)=>{
//                     db.collection('students', function (err, collection) {
//                         collection.find().toArray(function(err, items) {
//                         if(err) throw err; 
//                         var j =items.length;
//                         for(var i=0; i<j ; i++){
//                            if(items[i].Email == emailVerify){
//                              var item = items[i];
//                              res.render('home',{item:item})
//                                console.log(item)
//                            } 
//                         }
//                     })
//                     })
//                 })
//                 }
//             else{
//                 res.render('index',{error : 'You must be logged in'})
//               }
//             })
//     })

// app.post('/editstudent',upload.single('pic'),(req,res)=>{
//     var user = firebase.auth().currentUser,
//         userId = user.uid,
//         Email = req.body.email,
//         name = req.body.name,
//         address = req.body.address,
//         mobile = req.body.mobile,
//         dob = req.body.dob,
//         regNo = req.body.regNo,
//         bloodGroup = req.body.bloodGroup,
//         community = req.body.community,
//         pic = req.file.originalname ,
//         dept = req.body.dept,
//         username = req.body.username,
//         password = req.body.pwd ;
//     var id = req.params.id;
//     console.log(regNo)
//       user.updatePassword(password).then(function() {
//           console.log("pwd sent.") 
//           firebase.database().ref('users/'+ userId).update({
//             name: name,
//             email: Email,
//             pic : pic,
//             regNo : regNo,
//             address : address,
//             dept : dept,
//             bloodGroup : bloodGroup,
//             community :community,
//             username : username,
//             mobile : mobile,
//             dob : dob
//           }).then(()=>{
//                var item = {
//                     name:name,
//                     address:address,
//                     Email:Email,
//                     regNo:regNo,
//                     dept:dept,
//                     bloodGroup:bloodGroup,
//                     community:community,
//                     dob:dob,
//                     mobile:mobile,
//                     username:username,
//                     pic:pic
//                 }
// //               ======================================
// //               Here mongodb la update vakka paaru
// //               =====================================
//                   MongoClient.connect('mongodb://localhost/kit' , (err, db)=>{
//                     db.collection('students', function (err, collection) {
//                         collection.findOneAndUpdate({regNo:regNo},{ $set : { name:name,
//                                                                             address:address,
//                                                                             Email:Email,
//                                                                             regNo:regNo,
//                                                                             dept:dept,
//                                                                             bloodGroup:bloodGroup,
//                                                                             community:community,
//                                                                             dob:dob,
//                                                                             mobile:mobile,
//                                                                             username:username,
//                                                                             pic:pic  }},{returnOriginal: false, upsert: true},(err,item)=>{
//                             console.log(item.value)
//                             res.render('home',{item:item.value})
//                         })
//                     })
//                 })           
//                 });
//         })}, function(error) {
//           // An error happened.
//         })
    


// app.post('/staffsearch',(req,res)=>{
//     var person = req.body.search;
    
//     MongoClient.connect("mongodb://localhost/kit", function (err, db) {
    
//     db.collection('students', function (err, collection) {
        
//          collection.find().toArray(function(err, items) {
//             if(err) throw err;    
//              var j =items.length;
//              var x = 0;
//              for(var i=0;i<j;i++){
//                     if(items[i].regNo == person){
//                      var item = items[i];
//                      res.render('searchstudent',{item:item})
//                  }
//                  else{  
//                      x++;
//                      if(x==j){
//                      res.render('staffpage',{error : 'Enter a valid register number'});
//                     }}
//              }
//          });  
//     });             
// });
// })

// app.get('/logout',(req,res)=>{
//     req.logout()
//     res.redirect('/')
// })

// //===============================================================================================================
// //                                    BlueCard
// //===============================================================================================================

// app.get('/bluecard',(req,res)=>{
//     firebase.auth().onAuthStateChanged(function(user) {
//         if(user){
//             var user = firebase.auth().currentUser;
//             var emailVerify = user.email;
//                 MongoClient.connect('mongodb://localhost/kit' , (err, db)=>{
//                     db.collection('students', function (err, collection) {
//                         collection.find({'Email' : emailVerify }).toArray(function(err, items) {
//                                      if(err) throw err;    
//                                      var j =items.length;
//                                      console.log(items[0].marks.length)
//                                      var x = items[0].marks.length - 1;
//                                      var sems = items[0].marks[x].semester,
//                                          dept = items[0].marks[x].dept,
//                                          item = items[0];
//                                              if(sems == 1){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'English1',
//                                                                     sub2:'Mathematics1',
//                                                                     sub3:'Physics1',
//                                                                     sub4:'Chemistry1',
//                                                                     sub5:'ComputerProgramming',
//                                                                     sub6:'EngineeringGraphics'})
//                                              }else if(sems == 2 && dept == 'ece'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'English2',
//                                                                     sub2:'Mathematics2',
//                                                                     sub3:'Physics2',
//                                                                     sub4:'Chemistry2',
//                                                                     sub5:'CircuitTheory',
//                                                                     sub6:'ED'})
//                                              }else if(sems == 2 && dept == 'eee'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'English2',
//                                                                     sub2:'Mathematics2',
//                                                                     sub3:'Physics2',
//                                                                     sub4:'Chemistry2',
//                                                                     sub5:'CircuitTheory',
//                                                                     sub6:'BCME'})
//                                              }else if(sems == 2 && dept == 'cse'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'English2',
//                                                                     sub2:'Mathematics2',
//                                                                     sub3:'Physics2',
//                                                                     sub4:'DPSD',
//                                                                     sub5:'PCE',
//                                                                     sub6:'BCME'})
//                                              }else if(sems == 2 && dept == 'mech'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'English2',
//                                                                     sub2:'Mathematics2',
//                                                                     sub3:'Physics2',
//                                                                     sub4:'Chemistry2',
//                                                                     sub5:'BEEE',
//                                                                     sub6:'EM'})
//                                              }else if(sems == 2 && dept == 'aero'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'English2',
//                                                                     sub2:'Mathematics2',
//                                                                     sub3:'Physics2',
//                                                                     sub4:'Chemistry2',
//                                                                     sub5:'BEEE',
//                                                                     sub6:'EM'})
//                                              }else if(sems == 3 && dept == 'ece'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6351' ,
//                                                                     sub2: 'EE6352',
//                                                                     sub3:'EC6301',
//                                                                     sub4:'EC6302',
//                                                                     sub5:'EC6303' ,
//                                                                     sub6:'EC6304'})
//                                              }else if(sems == 3 && dept == 'eee'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA8357' ,
//                                                                     sub2:'GE8351',
//                                                                     sub3:'EE8301',
//                                                                     sub4:'EE8302' ,
//                                                                     sub5:'EC8304' ,
//                                                                     sub6:'EE8304' })
//                                              }else if(sems == 3 && dept == 'cse'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6351' ,
//                                                                     sub2:'CS6301',
//                                                                     sub3:'CS6302',
//                                                                     sub4:'CS6303' ,
//                                                                     sub5:'CS6304',
//                                                                     sub6:'GE6351' })
//                                              }else if(sems == 3 && dept == 'mech'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6351' ,
//                                                                     sub2:'CE6306',
//                                                                     sub3:'ME6301',
//                                                                     sub4: 'CE6451' ,
//                                                                     sub5:'ME6302' ,
//                                                                     sub6: 'EE6351' })
//                                              }else if(sems == 3 && dept == 'aero'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6351' ,
//                                                                     sub2: 'ME6352',
//                                                                     sub3: 'AE6301',
//                                                                     sub4:'CE6451' ,
//                                                                     sub5:'CE6452',
//                                                                     sub6: 'AE6302' })
//                                              }else if(sems == 4 && dept == 'ece'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6451',
//                                                                     sub2:'EC6401',
//                                                                     sub3:'EC6402',
//                                                                     sub4:'EC6403',
//                                                                     sub5:'EC6404',
//                                                                     sub6:'EC6405' })
//                                              }else if(sems == 4 && dept == 'eee'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'EC8404',
//                                                                     sub2:'EE8402',
//                                                                     sub3:'EE8403',
//                                                                     sub4:'EE8404',
//                                                                     sub5:'EE8405',
//                                                                     sub6:'EE8406' })
//                                              }else if(sems == 4 && dept == 'cse'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6453 ',
//                                                                     sub2:'CS6551',
//                                                                     sub3:'CS6401',
//                                                                     sub4:'CS6402' ,
//                                                                     sub5:'EC6504',
//                                                                     sub6:'CS6403' })
//                                              }else if(sems == 4 && dept == 'mech'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6452' ,
//                                                                     sub2:'ME6401',
//                                                                     sub3:'ME6402',
//                                                                     sub4:'ME6403' ,
//                                                                     sub5:'GE6351',
//                                                                     sub6:'ME6404' })
//                                              }else if(sems == 4 && dept == 'aero'){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                     sub1:'MA6459' ,
//                                                                     sub2:'AE6401',
//                                                                     sub3:'AE6402',
//                                                                     sub4:'AT6302' ,
//                                                                     sub5:'AE6403',
//                                                                     sub6:'AE6404' })
//                                              }else if(sems > 4 ){
//                                                  res.render('student',{
//                                                                     item:item,
//                                                                         })
//                                              }


//                                     })
//                                     })
//                                 })
//         }
//         else{
//             res.render('index',{error : 'You must be logged in'})
//          }
// })
// })


// app.post("/mark",(req,res)=>{
//     console.log("/mark")
//     var name=req.body.name,
//         regNo=req.body.regNo,
//         semester=req.body.sem,
//         dept=req.body.dept,
//         int=req.body.int,
//         sub1=req.body.sub1,
//         sub2=req.body.sub2,
//         sub3=req.body.sub3,
//         sub4=req.body.sub4,
//         sub5=req.body.sub5,
//         sub6=req.body.sub6,
//         code1=req.body.code1,
//         code2=req.body.code2,
//         code3=req.body.code3,
//         code4=req.body.code4,
//         code5=req.body.code5,
//         code6=req.body.code6
    
//     var mark = {
//         name:name,
//         regNo:regNo, 
//         semester:semester,
//         dept:dept,
//         int:int,
//         sub1:sub1,
//         sub2:sub2,
//         sub3:sub3,
//         sub4:sub4,
//         sub5:sub5,
//         sub6:sub6    
//     }
    
//     var maark = {
//         name:name,
//         regNo:regNo, 
//         semester:semester,
//         dept:dept,
//         int:int,
//         sub1: code1 + ' --- : --- ' +sub1,
//         sub2: code2 + ' --- : ---' +sub2,
//         sub3: code3 + ' --- : ---' +sub3,
//         sub4: code4 + ' --- : ---' +sub4,
//         sub5: code5 + ' --- : ---' +sub5,
//         sub6: code6 + ' --- : ---' +sub6 
//     }
//     console.log(maark)
//     MongoClient.connect("mongodb://localhost/kit", function (err, db) {
    
//         db.collection('students', function (err, collection) {
//             console.log(maark)
//             if(semester > 4){
//             collection.findOneAndUpdate({'regNo':regNo},{ $push: {'marks': maark}}).then(()=>{
//                                 console.log(maark)
//                                 res.render('markentry',{error : 'Marks Saved'});
//                             })}
//             else{
//                 collection.findOneAndUpdate({'regNo':regNo},{ $push: {'marks': mark}}).then(()=>{
//                                 console.log(mark)
//                                 res.render('markentry',{error : 'Marks Saved'});
//                             })}
//     })
//     })
// })

// app.get('/blue' ,isLoggedIn, (req,res)=>{
//     res.render('markentry')
// })

// app.get('/:id/academics',(req,res)=>{
    
//     var person = req.params.id;
    
//     MongoClient.connect("mongodb://localhost/kit", function (err, db) {
    
//     db.collection('students', function (err, collection) {
        
//          collection.find({'regNo' : person }).toArray(function(err, items) {
//             if(err) throw err;    
//              var j =items.length;
//              console.log(items[0].marks.length)
//              var x = items[0].marks.length - 1;
//              var sems = items[0].marks[x].semester,
//                  dept = items[0].marks[x].dept,
//                  item = items[0];
//                      if(sems == 1){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'English1',
//                                             sub2:'Mathematics1',
//                                             sub3:'Physics1',
//                                             sub4:'Chemistry1',
//                                             sub5:'ComputerProgramming',
//                                             sub6:'EngineeringGraphics'})
//                      }else if(sems == 2 && dept == 'ece'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'English2',
//                                             sub2:'Mathematics2',
//                                             sub3:'Physics2',
//                                             sub4:'Chemistry2',
//                                             sub5:'CircuitTheory',
//                                             sub6:'ED'})
//                      }else if(sems == 2 && dept == 'eee'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'English2',
//                                             sub2:'Mathematics2',
//                                             sub3:'Physics2',
//                                             sub4:'Chemistry2',
//                                             sub5:'CircuitTheory',
//                                             sub6:'BCME'})
//                      }else if(sems == 2 && dept == 'cse'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'English2',
//                                             sub2:'Mathematics2',
//                                             sub3:'Physics2',
//                                             sub4:'DPSD',
//                                             sub5:'PCE',
//                                             sub6:'BCME'})
//                      }else if(sems == 2 && dept == 'mech'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'English2',
//                                             sub2:'Mathematics2',
//                                             sub3:'Physics2',
//                                             sub4:'Chemistry2',
//                                             sub5:'BEEE',
//                                             sub6:'EM'})
//                      }else if(sems == 2 && dept == 'aero'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'English2',
//                                             sub2:'Mathematics2',
//                                             sub3:'Physics2',
//                                             sub4:'Chemistry2',
//                                             sub5:'BEEE',
//                                             sub6:'EM'})
//                      }else if(sems == 3 && dept == 'ece'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6351' ,
//                                             sub2: 'EE6352',
//                                             sub3:'EC6301',
//                                             sub4:'EC6302',
//                                             sub5:'EC6303' ,
//                                             sub6:'EC6304'})
//                      }else if(sems == 3 && dept == 'eee'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA8357' ,
//                                             sub2:'GE8351',
//                                             sub3:'EE8301',
//                                             sub4:'EE8302' ,
//                                             sub5:'EC8304' ,
//                                             sub6:'EE8304' })
//                      }else if(sems == 3 && dept == 'cse'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6351' ,
//                                             sub2:'CS6301',
//                                             sub3:'CS6302',
//                                             sub4:'CS6303' ,
//                                             sub5:'CS6304',
//                                             sub6:'GE6351' })
//                      }else if(sems == 3 && dept == 'mech'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6351' ,
//                                             sub2:'CE6306',
//                                             sub3:'ME6301',
//                                             sub4: 'CE6451' ,
//                                             sub5:'ME6302' ,
//                                             sub6: 'EE6351' })
//                      }else if(sems == 3 && dept == 'aero'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6351' ,
//                                             sub2: 'ME6352',
//                                             sub3: 'AE6301',
//                                             sub4:'CE6451' ,
//                                             sub5:'CE6452',
//                                             sub6: 'AE6302' })
//                      }else if(sems == 4 && dept == 'ece'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6451',
//                                             sub2:'EC6401',
//                                             sub3:'EC6402',
//                                             sub4:'EC6403',
//                                             sub5:'EC6404',
//                                             sub6:'EC6405' })
//                      }else if(sems == 4 && dept == 'eee'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'EC8404',
//                                             sub2:'EE8402',
//                                             sub3:'EE8403',
//                                             sub4:'EE8404',
//                                             sub5:'EE8405',
//                                             sub6:'EE8406' })
//                      }else if(sems == 4 && dept == 'cse'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6453 ',
//                                             sub2:'CS6551',
//                                             sub3:'CS6401',
//                                             sub4:'CS6402' ,
//                                             sub5:'EC6504',
//                                             sub6:'CS6403' })
//                      }else if(sems == 4 && dept == 'mech'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6452' ,
//                                             sub2:'ME6401',
//                                             sub3:'ME6402',
//                                             sub4:'ME6403' ,
//                                             sub5:'GE6351',
//                                             sub6:'ME6404' })
//                      }else if(sems == 4 && dept == 'aero'){
//                          res.render('student',{
//                                             item:item,
//                                             sub1:'MA6459' ,
//                                             sub2:'AE6401',
//                                             sub3:'AE6402',
//                                             sub4:'AT6302' ,
//                                             sub5:'AE6403',
//                                             sub6:'AE6404' })
//                      }else if(sems > 4 ){
//                          res.render('student',{
//                                             item:item,
//                                                 })
//                      }
                     

// //                 else{  
// //                     x++;
// //                     if(x==j){
// //                      alert("Please enter a valid Register number");
// //                     res.send("Hii");
// //                    }}
             
//          });  
//     });             
// });   
// })


// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.render('index',{error : 'You must be logged in'})
//     }
// }

app.listen(port , ()=>{
    console.log("started at 8084")
});
