var express = require('express');
var request = require('request');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/getAAByAlbumName', function(req, res) {

    if (req.query.albumName == "")
        console.log('here')
    else
        console.log('there')

    console.log(typeof req.query.albumName);
    console.log(req.query.albumName);
    var str = req.query.albumName.replace(/ /g, '%20');
    console.log(str);
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
