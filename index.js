const ping = require('ping');
const publicip = require('public-ip');
const geoip = require('geoip-lite');

// stolen from Rosetta Code or something
const haversine = ([lat1, lon1], [lat2, lon2]) => {
    const [pi, asin, sin, cos, sqrt] = ['PI', 'asin', 'sin', 'cos', 'sqrt'].map(k => Math[k]),

    [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2].map(x => x/180*pi),

    dLat = rlat2 - rlat1,
    dLon = rlon2 - rlon1,
    diameter = 12742; // km

    return diameter * asin(sqrt(
        sin(dLat/2)**2 + sin(dLon/2)**2 *
        cos(rlat1) * cos(rlat2)
    ));
};

var host = process.argv[2];

if(!host)
{
    console.log("lightping by juju2143 (https://github.com/juju2143/lightping)")
    console.log("usage: %s %s <hostname>", ...process.argv)
    process.exit();
}

const c = 299.792458; // km/ms
var ri = 1.468; // refraction index of fibre
var cf = c/ri; // speed of light in optical fibre

console.log("Starting ping...")
ping.promise.probe(host, {min_reply: 4})
.then(function (res) {
    //console.log(res);
    console.log("Host ip is %s (%s)", res.numeric_host, res.host);
    console.log("Average ping time in %d ms", res.avg)
    if(res.alive) publicip.v4().then((myip)=>{
        var me = geoip.lookup(myip);
        var geo = geoip.lookup(res.numeric_host);
        if(me && geo)
        {
            console.log("Host is at %d, %d", ...geo.ll);
            console.log("Your ip is %s", myip);
            console.log("You're at %d, %d", ...me.ll);
            var d = haversine(me.ll, geo.ll);
            console.log("Distance to host is %d km", d);
            var rate = (d/res.avg) / cf * 200;
            console.log("Your latency is rated %d under ideal conditions", rate);
        }
        else
        {
            console.log("Error: can't determine location");
        }
    })
    else console.log("Error: can't reach host");
});