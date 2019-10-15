[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mtrung/fonoapi/master/LICENSE)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

# FonoApi for Node.js

- Provide mobile device descriptions such as model, brand, cpu, gpu, dimensions, release date, etc...

------
###### Installation
```
npm install fonoapi-nodejs --save
```

###### Node.js example
```
var fonoapi = require('./fonoapi.node.js');
fonoapi.token = 'your_token';

// get devices w/ brand
fonoapi.getDevices(myCallback, 'iphone', 'apple');
// get devices w/o brand
fonoapi.getDevices(myCallback, 'iphone 6S');

// get latest devices from apple (limit result to 5)
fonoapi.getLatest(myCallback, 5, 'apple');

function myCallback(queryString, data) {
    console.log(data.Brand + " " + data.DeviceName);
    ...
}
```

###### Data Object Description

**Note** : Use a "_" before key if the key is starting with a number (example : _2g_bands, _4g_bands)

- DeviceName
- Brand
- technology
- 2g_bands
- gprs
- edge
- announced
- status
- dimensions
- weight
- sim
- type (display type)
- size
- resolution
- card_slot
- phonebook
- call_records
- camera_c (camera availability)
- alert_types
- loudspeaker_
- 3_5mm_jack_
- sound_c (Sound Quality)
- wlan
- bluetooth
- gps
- infrared_port
- radio
- usb
- messaging
- browser
- clock
- alarm
- games
- languages
- java
- features_c (additional features separated by "-")
- battery_c (battery information)
- stand_by (standby time)
- talk_time (standby time)
- colors (available colors)
- sensors
- cpu
- internal (memory + RAM)
- os
- body_c (body features separated by "-")
- keyboard
- primary_ (primary camera)
- video
- secondary (secondary camera)
- 3g_bands
- speed
- network_c
- chipset
- features  (additional features separated by "-")
- music_play
- protection
- gpu
- multitouch
- loudspeaker
- audio_quality
- nfc
- camera
- display
- battery_life
- 4g_bands
