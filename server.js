var fs = require("fs");
var http = require("http");
var url = require("url");
var transform = require("./src/transform.js")
var mapnik = require("mapnik");
var merc = new (require('sphericalmercator'))();

//return a query specified in the URL : http://url/tile?key=value
function urlQuery(query, key) {
    if (query && query[key]) {
        return query[key];
    }
}

// return the informations from the URL: z, x, y and layer if any (else, it will be layer 0)
function parseInfoURL(path, currentURL) {
    var z = path[2];
    var x = path[3];
    var y = path[4] ? path[4].split('.pbf')[0] : null;
    var info;
    var filepath = [z, x, y].join('/') + '.pbf';
    var exists = fs.existsSync('files/' + filepath)
        console.log('files/' + filepath);
        if (exists) {
            info = {
                z: parseInt(z),
                x: parseInt(x),
                y: parseInt(y),
                layer: urlQuery(currentURL.query, 'layer') | 0
            }
        }
    return info;
}

//run the server
//possible paths: /tiles/{z}/{x}/{y}.pbf
//                /src/file
//                /map(.html)
function onRequest(request, response) {
    var currentURL = url.parse(request.url, true);
    var path = currentURL.pathname.split('/');
    switch (path[1]) {
        case 'tiles':
            var info = parseInfoURL(path, currentURL);
            console.log('info: ' + info);
            if (info) {
                var type = urlQuery(currentURL.query, 'type');
                type = type ? type : 'geojson';
                if (type == 'geojson') {
                    console.log('geojson');
                    var layerContent = transform.toGeojson(info, 'files/' + [info.z, info.x, info.y].join('/') + '.pbf');
                    if (layerContent) {
                        response.writeHead(200, {'content-type': 'application/json'});
                        response.write(JSON.stringify(layerContent));
                        response.end();
                    }
                } else if (type == 'utfgrid') {
                    console.log('utfgrid');
                    fs.readFile('files/' + [info.z, info.x, info.y].join('/') + '.pbf',function(err,data){
                        if (err) throw err;
                        var pbfTile = new mapnik.VectorTile(info.z, info.x, info.y);
                        vt.setData(data,function(err){
                            var map = new mapnik.Map(256, 256);
                            map.loadSync('./src/stylesheet.xml');
                            map.extent = merc.bbox(info.x,info.y,info.z,false,'900913');
                            pbfTile.render(map, new mapnik.Grid(256, 256), {layer: info.layer}, function(err, grid) {
                                var utf = grid.encodeSync('utf');
                                response.writeHead(200, {'content-type': 'application/json'});
                                response.write(JSON.stringify(utf));
                                response.end();
                            });
                        });
                    });
                } else {
                    response.writeHead(404);
                    response.write('Unsupported tile type.');
                    response.end();
                }
            }
            break;

        case 'src':
            fs.exists('.' + currentURL.pathname, function(exists) {
                console.log('.' + currentURL.pathname);
                if (exists && currentURL.pathname != '/src/') {
                    response.writeHead(200);
                    response.write(fs.readFileSync('.' + currentURL.pathname));
                    response.end();
                }
            });
            break;

        case 'map':
        case 'map.html':
            response.writeHead(200);
            response.write(fs.readFileSync('./map.html'));
            response.end();
            break;

        default:
            response.writeHead(404);
            response.write('Not found.');
            response.end();

    }
}

(function() {
    http.createServer(onRequest).listen(8888);
    console.log('Server has started on http://0.0.0.0:8888 .');
})();
