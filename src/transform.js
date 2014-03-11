var mapnik = require('mapnik');
var Vector = require('mapnik').VectorTile;
var fs = require('fs');
var path = require('path');
var mercator = new(require('sphericalmercator'));

module.exports.toUTFGrid = function(coord, filename, callback) {
    var tile = new Vector(coord.z, coord.x, coord.y);
    console.log("image: " + coord);
    tile.setDataSync(
        fs.readFileSync(filename)
    );
    var map = new mapnik.Map(tile.width(),tile.height());
    map.loadSync('./src/style.xml');
    map.extent = mercator.bbox(coord.x, coord.y, coord.z, false, '900913');
    map.extent = [-20037508.34, -20037508.34, 20037508.34, 20037508.34];
    tile.render(map, new mapnik.Grid(256, 256), {layer: 0}, function(err, vtile_image) {
        if (err) throw err;
        var buffer = vtile_image.encodeSync('utf');
        callback(buffer);
    });
};

module.exports.toGeojson = function(coord, filename) {
    console.log(coord);
    var tile = new Vector(coord.z, coord.x, coord.y);
    tile.setDataSync(
        fs.readFileSync(filename)
    );
    try {
        geojsonTile = tile.toGeoJSON(coord.layer)
    } catch (e) {
        throw(e);
    }
    return geojsonTile;
};
