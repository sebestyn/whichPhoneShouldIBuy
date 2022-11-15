require("dotenv").config();
//PACKAGES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fonoapi = require("fonoapi-nodejs");

//OWN
const date = new Date().toISOString().slice(0, 19);
fonoapi.token = "2d38b2fefccfff3e1e1a92874657e7feaa787fe7a7d645e1";
var logedIn = false;

//DB
var deviceDB = require("./models/deviceDB-model");

//USE
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 100000,
    })
);

//DATABASE
mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("DATABASE CONNECTED");
    }
);

//CHOOSE LANGUAGE
app.get("/", function (req, res) {
    res.render("choose-lang.ejs");
});

//HUNGARY HOME
app.get("/hu", function (req, res) {
    res.render("home-hu.ejs");
});
//ENGLISH HOME
app.get("/en", function (req, res) {
    res.render("home-en.ejs");
});

//LOGIN / LOGOUT
app.get("/login", function (req, res) {
    if (logedIn) {
        res.redirect("/admin");
    } else {
        res.render("login.ejs");
    }
});
app.post("/admin", function (req, res) {
    const pw = req.body.pw;
    //PASSWORD = sebestyn
    if (
        pw ==
        "435n123y3242t4234535s67e874562b5464e231234s3123"
            .split("")
            .reverse()
            .join("")
            .replace(/[0-9]/g, "")
    ) {
        logedIn = true;
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
});
app.get("/logout", function (req, res) {
    logedIn = false;
    res.redirect("/login");
});

//ADMIN PAGE
//MAIN PAGE
app.get("/admin", function (req, res) {
    if (logedIn) {
        deviceDB.find({}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.render("admin.ejs", { savedPhones: data });
            }
        });
    } else {
        res.redirect("/login");
    }
});
//SEARCH FOR DEVICE WITH API
app.post("/searchForDevice", function (req, res) {
    let deviceNameSearch = req.body.deviceName;
    let clearAllPhones = [];
    fonoapi.getDevices(function (searchingWord, data) {
        if (data.length > 0) {
            data.forEach((telefon) => {
                //SELECT JUST IMPORTANT PARTS
                phone_important = {
                    deviceName: telefon.DeviceName,
                    brand: telefon.Brand,
                    announced: telefon.announced,
                };
                //OS
                try {
                    phone_important.os = telefon.os.split(" ")[0];
                } catch (err) {
                    phone_important.os = undefined;
                }
                //SIZE
                try {
                    phone_important.size = Number(telefon.size.split(" ")[0]);
                } catch (err) {
                    phone_important.size = undefined;
                }
                //CPU
                try {
                    let cpu_array = telefon.cpu.split(" ");
                    let cpu = cpu_array[cpu_array.indexOf("GHz") - 1];
                    if (cpu.charAt(0) == "(") {
                        cpu = cpu.substr(1);
                    }
                    phone_important.cpu = cpu;
                } catch (err) {
                    phone_important.cpu = undefined;
                }
                //RAM
                try {
                    let ram;
                    let ram_array = telefon.internal.split(" ");
                    if (!isNaN(ram_array[ram_array.indexOf("RAM") - 2])) {
                        ram =
                            ram_array[ram_array.indexOf("RAM") - 2] +
                            ram_array[ram_array.indexOf("RAM") - 1];
                    } else {
                        ram = ram_array[ram_array.indexOf("RAM") - 1];
                    }
                    phone_important.ram = ram;
                } catch (err) {
                    phone_important.ram = undefined;
                }
                //BATTERY
                try {
                    let battery_array = telefon.battery_c.split(" ");
                    let battery =
                        battery_array[battery_array.indexOf("mAh") - 1];
                    phone_important.battery = battery;
                } catch (err) {
                    phone_important.battery = undefined;
                }
                //SIM
                try {
                    if (
                        telefon.sim.split(" ").includes("Dual") ||
                        telefon.sim.split(" ").includes("dual")
                    ) {
                        phone_important.sim = "dual";
                    } else {
                        phone_important.sim = "single";
                    }
                } catch (err) {
                    phone_important.sim = undefined;
                }
                //SCREEN TYPE
                try {
                    if (
                        telefon.type.split(" ").includes("AMOLED") ||
                        telefon.type.split(" ").includes("Amoled")
                    ) {
                        phone_important.screenType = "AMOLED";
                    } else if (
                        telefon.type.split(" ").includes("OLED") ||
                        telefon.type.split(" ").includes("Oled")
                    ) {
                        phone_important.screenType = "OLED";
                    } else {
                        phone_important.screenType = "other";
                    }
                } catch (err) {
                    phone_important.screenType = undefined;
                }
                //SCREEN RESOLUTION
                try {
                    let resolution_array = telefon.resolution.split(" ");
                    let resolution =
                        resolution_array[
                            resolution_array.indexOf("pixels") - 3
                        ] +
                        resolution_array[
                            resolution_array.indexOf("pixels") - 2
                        ] +
                        resolution_array[
                            resolution_array.indexOf("pixels") - 1
                        ];
                    if (!resolution) {
                        resolution =
                            resolution_array[
                                resolution_array.indexOf("pixels,") - 3
                            ] +
                            resolution_array[
                                resolution_array.indexOf("pixels,") - 2
                            ] +
                            resolution_array[
                                resolution_array.indexOf("pixels,") - 1
                            ];
                    }
                    phone_important.resolution = resolution;
                } catch (err) {
                    phone_important.resolution = undefined;
                }
                //PRICE
                try {
                    if (telefon.price.split(" ").includes("EUR")) {
                        phone_important.price =
                            telefon.price.split(" ")[
                                telefon.price.split(" ").indexOf("EUR") - 1
                            ];
                    } else {
                        phone_important.price = "-";
                    }
                } catch (err) {
                    phone_important.price = undefined;
                }
                //NFC
                try {
                    phone_important.nfc = telefon.nfc.split(" ")[0];
                } catch (err) {
                    phone_important.nfc = undefined;
                }
                clearAllPhones.push(phone_important);
            });
        }
        res.send({ phones: clearAllPhones });
    }, deviceNameSearch);
});
//SAVE DEVICE TO DATABASE
app.post("/saveToDB", function (req, res) {
    let phoneCome = req.body.phone;
    let phoneToSave = new deviceDB(phoneCome);
    phoneToSave.save(function (err, data) {
        if (err) {
            console.log(err);
            res.send({ success: false });
        } else {
            console.log("ELMENTVE AZ ADATBÁZISBA: " + data.deviceName);
            res.send({ success: true, phoneName: data.deviceName });
        }
    });
});

//CALCULATE BEST PHONES
app.post("/data", function (req, res) {
    var wantSpecs = req.body.arr;
    console.log("/data");
    deviceDB.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("DB SEARCH");
            let allPhones = data;
            let bestPhone;
            let bestPoint = 0;
            for (phone of allPhones) {
                let checkingPhonePoint = calculatePhonePoint(wantSpecs, phone);
                if (checkingPhonePoint > bestPoint) {
                    bestPoint = checkingPhonePoint;
                    bestPhone = phone;
                }
            }
            res.send({ bestPhone: bestPhone });
        }
    });
});

//FUNCTIONS

//CALCULATE PHONE POINT
function calculatePhonePoint(wantSpecs, phone) {
    let osszPont = 0;

    //MIÉRT MENNYI PONT
    let osP = 30;
    let priceP = 10;
    let sizeP = 8;
    let cameraP = 7;
    let cpuPSzorzo = 0.7;
    let ramPSzorzo = 1;
    let batteryPSzorzo = 0.002;
    let screenP = 5;
    let screenPSzorzo = 1;
    let payP = 20;
    let simP = 15;

    //OS
    if (phone.os == "-") {
        osszPont += osP / 2;
    } else if (wantSpecs[0].toLowerCase() == phone.os.toLowerCase()) {
        osszPont += osP;
    }
    //PRICE
    if (
        (wantSpecs[1] == "300" && Number(phone.price) < 320) ||
        (wantSpecs[1] == "300-600" &&
            Number(phone.price) < 620 &&
            Number(phone.price) > 280) ||
        (wantSpecs[1] == "600" && Number(phone.price) > 500)
    ) {
        osszPont += priceP;
    }
    //SIZE
    if (wantSpecs[2] == "small" && Number(phone.size) < 6) {
        osszPont += sizeP;
    } else if (wantSpecs[2] == "normal" && Number(phone.size) > 6) {
        osszPont += sizeP;
    }
    //CAMERA ?

    //PLAY GAMES
    let ram = parseInt(phone.ram);
    var cpu = phone.cpu;
    if (cpu.includes("x")) {
        cpu = cpu.replace("x", "*");
        cpu = eval(cpu);
    }
    cpu = Number(cpu);
    if (wantSpecs[4] == "games") {
        osszPont += cpu * cpuPSzorzo;
        osszPont += ram * ramPSzorzo;
    }
    //BATTERY
    if (wantSpecs[5] == "battery") {
        osszPont += Number(phone.battery) * batteryPSzorzo;
    }
    //SCREEN
    if (wantSpecs[6] == "screen") {
        s_width = Number(phone.resolution.split("x")[0]);
        s_height = Number(phone.resolution.split("x")[1]);
        osszPont += (s_width / 500 + s_height / 500) * screenPSzorzo;
        if (phone.screenType == "AMOLED" || phone.screenType == "OLED") {
            osszPont += screenP;
        }
    }
    //PAY
    if (wantSpecs[7] == "pay" && phone.nfc.toLowerCase() == "yes") {
        osszPont += payP;
    }
    //DUAL SIM
    if (wantSpecs[8] == "2sim" && phone.sim == "dual") {
        osszPont += simP;
    }
    console.log(phone.deviceName + ": " + osszPont);
    return osszPont;
}

//SERVER INDÍTÁSA
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("MYNEWS Server Has Started!");
});
