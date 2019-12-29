//VÁLTOZÓK
    //PACKAGES
    const express = require("express");
    const app = express();
    const bodyParser = require("body-parser");
    const mongoose = require("mongoose");
    const fonoapi = require('fonoapi-nodejs');

    //OWN
    const halozatiServer = true;
    const date = new Date().toISOString().slice(0, 19);
    fonoapi.token = '2d38b2fefccfff3e1e1a92874657e7feaa787fe7a7d645e1';
    var logedIn = false;

    //DB
    var deviceDB = require("./models/deviceDB-model");


//USE
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:100000}));

//DATABASE
mongoose.connect("mongodb+srv://sebestyn:sebestyn@cluster0-uek7j.gcp.mongodb.net/whichPhone?retryWrites=true&w=majority", 
{ useNewUrlParser: true, useUnifiedTopology: true }, 
() => {
    console.log('DATABASE CONNECTED');
});

//CHOOSE LANGUAGE
app.get("/",function(req,res){
    res.render("choose-lang.ejs")
});

//HUNGARY HOME
app.get("/hu",function(req,res){
    res.render("home-hu.ejs")
});

//ENGLISH HOME
app.get("/en",function(req,res){
    res.render("home-en.ejs")
});


//LOGIN / LOGOUT
app.get("/login",function(req,res){
    if(logedIn){
        res.redirect("/admin")
    } else {
        res.render("login.ejs")
    }
});
app.post("/admin",function(req,res){
    const pw = req.body.pw;
    if (pw == "435n123y3242t4234535s67e874562b5464e231234s3123".split("").reverse().join("").replace(/[0-9]/g, '') ){
        logedIn = true;
        res.send({success:true})
    } else {
        res.send({success:false})
    }
});
app.get("/logout",function(req,res){
    logedIn = false;
    res.redirect("/login") 
});

//ADMIN PAGE
    //MAIN PAGE
    app.get("/admin",function(req,res){
        if(logedIn){
            deviceDB.find({},function(err,data){
                if(err){
                    console.log(err)
                } else {
                    res.render("admin.ejs",{savedPhones:data});
                }
            });
        } else {
            res.redirect("/login")
        }
    });
    //SEARCH FOR DEVICE WITH API
    app.post("/searchForDevice",function(req,res){
        let deviceName = req.body.deviceName;
        fonoapi.getDevices(function(searchingWord, data){
            res.send({phones:data})
        },deviceName);
    });
    //SAVE DEVICE TO DATABASE
    app.post("/saveToDB",function(req,res){
        let phoneCome = req.body.phone;
        let phoneToSave = new deviceDB(phoneCome);
        phoneToSave.save(function(err, data){
            if (err){
                console.log(err)
                res.send({success:false})
            } else {
                console.log("ELMENTVE AZ ADATBÁZISBA: " + data.DeviceName );
                res.send({success:true,phoneName:data.DeviceName})
            }
        });
    });


//CALCULATE BEST PHONES
app.post("/data",function(req,res){
    var wantSpecs = req.body.arr;
    deviceDB.find({},function(err,data){if(err){console.log(1)}
    else {
            
            let allPhones = data;
            let bestPhone = {_doc:{point:0}};

            for (phone of allPhones){   
                           
                let checkingPhonePoint = calculatePhonePoint(wantSpecs, phone)
                
                if(checkingPhonePoint > bestPhone._doc.point ){
                    bestPhone = Object.assign({}, phone); ;
                    bestPhone._doc.point = checkingPhonePoint
                }
            }
            console.log(bestPhone._doc)

            res.send({phone:bestPhone._doc})
        }
    });
});


//FUNCTIONS

//CALCULATE PHONE POINT
function calculatePhonePoint(wantSpecs, phone){
    return Math.floor(Math.random() * 11)
}




//SERVER INDÍTÁSA  
if(halozatiServer){
    var port = process.env.PORT || 4000;
    app.listen(port, function () {
    console.log("MYNEWS Server Has Started!");
    });
} else {
    app.listen(process.env.PORT, process.env.IP, function () {
        console.log("SERVER IS RUNNING...");
    });
}
