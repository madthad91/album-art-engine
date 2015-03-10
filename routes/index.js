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
    //var flag = 0;
    console.log("herro motto");

    var str = req.query.albumName.replace(/ /g, '%20');
    console.log(str + " is after the replacement")
    var le_url = 'http://api.spotify.com/v1/search?q=' + str + '&type=album';
    console.log('and the resolved url is: ' + le_url);
    request(le_url, function(error, response, body) {

        var result = JSON.parse(body);

        for (var i = 0; i < result.albums.items.length; i++) {
            
            if (result.albums.items[i].name.toLowerCase().indexOf(req.query.albumName.toLowerCase()) > -1) {
                res.write(result.albums.items[i].images[0].url);
                //flag = 1;

            } else if (req.query.albumName.toLowerCase().split(" ").indexOf('and')>-1) {

                /*var str3 = req.query.albumName.toLowerCase().replace(/ and /g, ' & ');
                console.log(str3);
                if (result.albums.items[i].name.toLowerCase().indexOf(str3.toLowerCase()) > -1) {
                    res.write(result.albums.items[i].images[0].url);
                    //flag = 1;
                }*/

                var tempArr = req.query.albumName.toLowerCase().split(" ");
                var tempArrIndex = tempArr.indexOf('and');

                if (result.albums.items[i].name.toLowerCase().split(" ").indexOf(tempArr[tempArrIndex]) > -1) {
                    res.write(result.albums.items[i].images[0].url);
                    res.end();
                    //flag = 1;
                }


            } else if (req.query.albumName.toLowerCase().split(" ").indexOf('&')>-1) {

                var tempArr = req.query.albumName.toLowerCase().split(" ");
                var tempArrIndex = tempArr.indexOf('&');

                /*var str3 = req.query.albumName.toLowerCase().replace(/ & /g, ' And ');
                console.log(str3);*/
                if (result.albums.items[i].name.toLowerCase().split(" ").indexOf(tempArr[tempArrIndex]) > -1) {
                    res.write(result.albums.items[i].album.images[0].url);
                    res.end();
                    //flag = 1;
                }
            }


        }

        res.end();

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
});

module.exports = router;
