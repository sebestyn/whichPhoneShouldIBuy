const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceName: String,
    brand: String,
    pictureURL:String,
    shopURL:String,
    announced: String,
    sim: String,
    screenType: String,
    size: String,
    resolution: String,
    battery: String,
    cpu: String,
    ram: String,
    os: String,
    nfc: String,
    price: String,
});

const deviceDB = mongoose.model('device', deviceSchema);

module.exports = deviceDB;
