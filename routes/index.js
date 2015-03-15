var express = require('express');
var request = require('request');
var AAHelper = require('../helpers/AAHelper.js');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/getAA', function(req, res, next) {

    var ip_address = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

    if (req.query.album_name == "" || typeof req.query.album_name == "undefined") {

        var temp_song_name = req.query.song_name
                                .replace(/\(([^)]+)\)/, " ")
                                .replace(/\[([^)]+)\]/, " ")
                                .replace(/%5B([^)]+)%5D/, " ")
                                .replace(/%28([^)]+)%29/, " ");
                
        var song_arr = temp_song_name.trim().split(" ");
        if (song_arr[0].toLowerCase() == "the" || song_arr[0].toLowerCase() == "a" || song_arr[0].toLowerCase() == "an") {
            delete song_arr[0];
        }
        var song_arrSize = song_arr.length - 1;
        if (song_arr[song_arrSize].toLowerCase() == "the" || song_arr[song_arrSize].toLowerCase() == "a" || song_arr[song_arrSize].toLowerCase() == "an") {
            delete song_arr[song_arrSize];
        }

        var temp_artist_name = req.query.artist_name
                                .replace(/\(([^)]+)\)/, " ")
                                .replace(/\[([^)]+)\]/, " ")
                                .replace(/%5B([^)]+)%5D/, " ")
                                .replace(/%28([^)]+)%29/, " ");
            
        var artist_arr = temp_artist_name.trim().split(" ");
        if (artist_arr[0].toLowerCase() == "the" || artist_arr[0].toLowerCase() == "a" || artist_arr[0].toLowerCase() == "an") {
            delete artist_arr[0];
        }
        var artist_arrSize = artist_arr.length - 1;
        if (artist_arr[artist_arrSize].toLowerCase() == "the" || artist_arr[artist_arrSize].toLowerCase() == "a" || artist_arr[artist_arrSize].toLowerCase() == "an") {
            delete artist_arr[artist_arrSize];
        }

        res.status(200);
        var song_name = song_arr.join(" ").replace(/ /g, '%20');
        console.log(song_name + " is the song name after the replacement");

        var artist_name = artist_arr.join(" ").replace(/ /g, '%20');
        console.log(artist_name + " is the artist name after the replacement");

        var temp_url = 'http://api.spotify.com/v1/search?q=' + song_name + '&type=track';
        console.log('and the resolved url is: ' + temp_url);

        request(temp_url, function(error, response, body) {
            res.set('Content-Type', 'application/json')
                .json({url: AAHelper.getAABySongName(body, artist_arr.join(" "), {url:temp_url, ip:ip_address})});
        });
        return;
    } else {

        var temp_album_name = req.query.album_name
                                .replace(/\(([^)]+)\)/, " ")
                                .replace(/\[([^)]+)\]/, " ")
                                .replace(/%5B([^)]+)%5D/, " ")
                                .replace(/%28([^)]+)%29/, " ");
            
        var album_arr = req.query.album_name.trim().split(" ");
        if (album_arr[0].toLowerCase() == "the" || album_arr[0].toLowerCase() == "a" || album_arr[0].toLowerCase() == "an") {
            delete album_arr[0];
        }
        var album_arrSize = album_arr.length - 1;
        if (album_arr[album_arrSize].toLowerCase() == "the" || album_arr[album_arrSize].toLowerCase() == "a" || album_arr[album_arrSize].toLowerCase() == "an") {
            delete album_arr[album_arrSize];
        }
        res.status(200);
        var album_name = album_arr.join(" ").replace(/ /g, '%20');
        var temp_url = 'http://api.spotify.com/v1/search?q=' + album_name + '&type=album';
        console.log('and the resolved url is: ' + temp_url);
        request(temp_url, function(error, response, body) {

            res.set('Content-Type', 'application/json')
                .json({url:AAHelper.getAAByAlbumName(body, album_arr.join(" "),  {url:temp_url, ip:ip_address})});


        });
        return;

    }


});

router.get('/getAAByAlbumName', function(req, res) {

    var str = req.query.albumName.replace(/ /g, '%20');
    var temp_url = 'http://api.spotify.com/v1/search?q=' + str + '&type=album';
    console.log('and the resolved url is: ' + temp_url);
    request(temp_url, function(error, response, body) {

        var result = JSON.parse(body);

        for (var i = 0; i < result.albums.items.length; i++) {

            //no .split on the first check because it's searching a phrase
            if (result.albums.items[i].name.toLowerCase().indexOf(req.query.albumName.toLowerCase()) > -1) {
                res.status(200).send(result.albums.items[i].images[0].url.toString());
                return;


            } else if (req.query.albumName.toLowerCase().split(" ").indexOf('and') > -1) {

                //safely flip all and's to &'s
                var tempArr = req.query.albumName.toLowerCase().split(" ");
                for (var y = 0; y < tempArr.length; y++) {
                    if (tempArr[y].indexOf("and") > -1) tempArr[y] = "&";
                }

                if (result.albums.items[i].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                    res.status(200).send(result.albums.items[i].images[0].url);
                    return;
                }


            } else if (req.query.albumName.toLowerCase().split(" ").indexOf('&') > -1) {

                //safely flip all &'s to and's
                var tempArr = req.query.albumName.toLowerCase().split(" ");
                for (var z = 0; z < tempArr.length; z++) {
                    if (tempArr[z].indexOf("&") > -1) tempArr[z] = "and";
                }

                if (result.albums.items[i].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                    res.status(200).send(result.albums.items[i].album.images[0].url);
                    return;
                }
            }

        }
        res.status(200).send("false");
        return;
        // res.end();

    });
    /*.on('error', function(e) {
            console.log("Got error: " + e.message);
        });*/
    /*       Parse.Cloud.httpRequest({
               url: 'https://api.spotify.com/v1/search?q=' + str + '&type=album',
               success: function(httpResponse) {
               },
               error: function(httpResponse) {
                   res.send('Request failed with response code ' + httpResponse.status)
               }
           });
    */
    /*    res.status(200).send("false");
        return;
    */
});

router.get('/getAABySongName', function(req, res) {

    var song_name = req.query.songName.replace(/ /g, '%20');
    console.log(song_name + " is the song name after the replacement");

    var artist_name = req.query.artistName.replace(/ /g, '%20');
    console.log(artist_name + " is the artist name after the replacement");

    var temp_url = 'http://api.spotify.com/v1/search?q=' + song_name + '&type=track';
    console.log('and the resolved url is: ' + temp_url);

    request(temp_url, function(error, response, body) {

        var result = JSON.parse(body);

        for (var i = 0; i < result.tracks.items.length; i++) {
            for (var j = 0; j < result.tracks.items[i].artists.length; j++) {
                if (result.tracks.items[i].artists[j].name.toLowerCase().indexOf(req.query.artistName.toLowerCase()) > -1) {
                    res.status(200).send(result.tracks.items[i].album.images[0].url);
                    return;

                } else if (req.query.artistName.toLowerCase().split(" ").indexOf('and') > -1) {

                    //safely flip all and's to &'s
                    var tempArr = req.query.artistName.toLowerCase().split(" ");
                    for (var y = 0; y < tempArr.length; y++) {
                        if (tempArr[y].indexOf("and") > -1) tempArr[y] = "&";
                    }

                    if (result.tracks.items[i].artists[j].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                        res.status(200).send(result.tracks.items[i].album.images[0].url);
                        return;

                    }
                } else if (req.query.artistName.toLowerCase().split(" ").indexOf('&') > -1) {

                    //safely flip all &'s to and's
                    var tempArr = req.query.artistName.toLowerCase().split(" ");
                    for (var z = 0; z < tempArr.length; z++) {
                        if (tempArr[z].indexOf("&") > -1) tempArr[z] = "and";
                    }

                    if (result.tracks.items[i].artists[j].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                        res.status(200).send(result.tracks.items[i].album.images[0].url);
                        return;

                    }
                }
            }

        }

        res.status(200).send("false");
        return;
    });
    /*,
          error: function(httpResponse) {
            res.send('Request failed with response code ' + httpResponse.status)
          }
        });
     */
});

module.exports = router;
