var request = require('request'),
    sprintf=require("sprintf-js").sprintf,
    counter=0,
    resolved_url,
    nodemailer = require('nodemailer');



exports.getAABySongName = function(body, artistName, err_packet) {



    var result = JSON.parse(body);

    for (var i = 0; i < result.tracks.items.length; i++) {
        for (var j = 0; j < result.tracks.items[i].artists.length; j++) {
            if (result.tracks.items[i].artists[j].name.toLowerCase().indexOf(artistName.toLowerCase()) > -1) {
                //res.status(200).send(result.tracks.items[i].album.images[0].url);
                return result.tracks.items[i].album.images[0].url;

            } else if (artistName.toLowerCase().split(" ").indexOf('and') > -1) {

                //safely flip all and's to &'s
                var tempArr = artistName.toLowerCase().split(" ");
                for (var y = 0; y < tempArr.length; y++) {
                    if (tempArr[y].indexOf("and") > -1) tempArr[y] = "&";
                }

                if (result.tracks.items[i].artists[j].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                    //res.status(200).send(result.tracks.items[i].album.images[0].url);
                    return result.tracks.items[i].album.images[0].url;

                }
            } else if (artistName.toLowerCase().split(" ").indexOf('&') > -1) {

                //safely flip all &'s to and's
                var tempArr = artistName.toLowerCase().split(" ");
                for (var z = 0; z < tempArr.length; z++) {
                    if (tempArr[z].indexOf("&") > -1) tempArr[z] = "and";
                }

                if (result.tracks.items[i].artists[j].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                    //res.status(200).send(result.tracks.items[i].album.images[0].url);
                    return result.tracks.items[i].album.images[0].url;

                }
            }
        }

    }

    //res.status(200).send("false");
    this.logError(err_packet);
    return "false";
};

exports.getAAByAlbumName = function(body, album_name, err_packet) {

    var result = JSON.parse(body);
    for (var i = 0; i < result.albums.items.length; i++) {

        //no .split on the first check because it's searching a phrase
        if (result.albums.items[i].name.toLowerCase().indexOf(album_name.toLowerCase()) > -1) {
            //res.status(200).send(result.albums.items[i].images[0].url.toString());
            return result.albums.items[i].images[0].url.toString();


        } else if (album_name.toLowerCase().split(" ").indexOf('and') > -1) {

            //safely flip all and's to &'s
            var tempArr = album_name.toLowerCase().split(" ");
            for (var y = 0; y < tempArr.length; y++) {
                if (tempArr[y].indexOf("and") > -1) tempArr[y] = "&";
            }

            if (result.albums.items[i].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                //res.status(200).send(result.albums.items[i].images[0].url);
                return result.albums.items[i].images[0].url;
            }


        } else if (album_name.toLowerCase().split(" ").indexOf('&') > -1) {

            //safely flip all &'s to and's
            var tempArr = album_name.toLowerCase().split(" ");
            for (var z = 0; z < tempArr.length; z++) {
                if (tempArr[z].indexOf("&") > -1) tempArr[z] = "and";
            }

            if (result.albums.items[i].name.toLowerCase().indexOf(tempArr.join(" ").toLowerCase()) > -1) {
                //res.status(200).send(result.albums.items[i].album.images[0].url);
                return result.albums.items[i].album.images[0].url;
            }
        }

    }
    //res.status(200).send("false");
    this.logError(err_packet);
    return "false";
    // res.end();


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
};

exports.logError = function(err){
    // no need to set the from property, already set
/*    var mail = new Email(
    { to: "uta.mobi@gmail.com"
    , subject: sprintf("Bug Report For ID: %010.0f", ++counter)
    , body: "User ip:"+err.ip+" <br />Had issues with this url: "+err.url
    })*/
   /* mail.send();*/

   // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'uta.mobi@gmail.com',
            pass: 'Mobi2014'
        }
    });

    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'UTARADIOLOGGER <UTARADIOLOGGER@NO-REPLY.COM>', // sender address
        to: 'uta.mobi@gmail.com', // list of receivers
        subject: sprintf("Bug Report For ID: %010.0f", ++counter), // Subject line
        html: "User ip:"+err.ip+" <br />Had issues with this url: "+err.url // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });

}



