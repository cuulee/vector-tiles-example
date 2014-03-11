var fs = require('fs');
var read = require('./read_vtiles.js');

for (var l=0; l<23; l++) {
    content = read.toGeojson({z:14, x:8716, y:8015, layer:l}, './14_8716_8015.vector.pbf');
    console.log(content);
    f = fs.openSync("./toto", 'a');
    fs.appendFileSync("./toto", "\n" + JSON.stringify(content));
    fs.closeSync(f);
}
