
var gea = require("gea-sdk");
var adapter = require("gea-adapter-usb");
 
var app = gea.configure({
    address: 0xcb,
});
 
app.plugin(require("gea-plugin-range"));

app.bind(adapter, function (bus) { bus.once("range", function (range) {
 
   console.log("range version:", range.version.join("."));

   function enableWifi() {
        console.log('send wifi message');
        bus.write({
            source: 0xcb,
            destination: 0x80,
            erd: 0x6003,
            data: [0x03]
        });
    }
 
    enableWifi();
    setInterval(enableWifi, 30 * 1000);

    range.upperOven.remoteEnable.subscribe(function (enabled) {
        if (enabled) {
            console.log("remote control is enabled!");
            console.log("starting to cook.");
            console.log("press the cancel button to stop cooking.");
            
            range.upperOven.cookMode.write({
                mode: 18,                    // convection roast no option
                cookTemperature: 450,        // degrees in fahrenheit
                cookHours: 1,                // number of hours
                cookMinutes: 0               // number of minutes
            });

        }
        else {
            console.error("remote control is disabled!");
            console.error("press the remote enable button.");
            enableWifi();
        }
    });

    range.ovenConfiguration.subscribe(function(value) {
        console.log("oven configuration changed:", value);
    });
    range.upperOven.currentState.subscribe(function(value) {
        console.log("upper oven current state changed:", value);
    });
    range.upperOven.cookMode.subscribe(function(value) {
        console.log("upper oven cook mode changed:", value);
    });
    range.upperOven.cookTimeRemaining.subscribe(function(value) {
        console.log("time remaining :", value)
    });
    range.upperOven.probeDisplayTemperature.subscribe(function(value) {
        console.log("probe temperature remaining :", value)
    });

    });
});
