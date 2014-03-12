#vector-tiles-example

This project is a very basical example of server and client in Node.js which use Mapnik's PBF tiles. It was just a test, do not deploy it as it is now!!

This is no awesome project, I just learn how to use Node-mapnik's API and if you are lost in the huge amount of information, it could be helpful for you. The idea came to me because of [jimmyrock's really nice hack](https://github.com/jimmyrocks/mapnik-vector-tile-converter) of my [Mapnik-vector-converter project](https://github.com/vross/mapnik-vector-tile-converter).

## Dependancies and attribution

For the server conversion, the code is based on [Node-mapnik](https://github.com/mapnik/node-mapnik) to convert PBF tiles to another format (GeoJSON works, UTFGrid not yet, and no images here, but it would be possible).

Client side, the file TileLayer.GeoJSON.js in the src folder comes from [glenrobertson's project](https://github.com/glenrobertson/leaflet-tilelayer-geojson) ([license](https://github.com/glenrobertson/leaflet-tilelayer-geojson/blob/master/LICENCE)).


## Usage

Run the server:
<pre><code>
    node server.js
</code></pre>

In your browser, go to <code> 127.0.0.1:8888/map </code>. That's it!
