require("dotenv").config(); 
var keys = require("./keys.js");
var Twitter = require('./node_modules/twitter');
var Spotify = require('./node_modules/node-spotify-api');
var omdb = require('omdb');
var request = require('request'); 
var inquirer = require('inquirer');
var fs = require("fs"); 
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var tweetsNum = 3; 

var movieName = ""; 
var string = ""; 
var input = process.argv;
var validateTwitter = "my-tweets";
var validateSpotify = "spotify-this-song"; 
var validateOmdb = "movie-this"; 
var validateRandom = "do-what-it-says";

//creates a string for the input to search for a multi-worded input
for (var i = 3; i < input.length; i++) { 
    string = string + input[i] + " "; 
}  
function getTweets() {    
// client.get(path, params, callback)
client.get('search/tweets', {q: 'trump', count: tweetsNum }, function(error, tweets, response) {
    if(!error) {
    for (var i =0; i < tweetsNum; i++) {
        //THIS BREAKS EVERY ONCE AND A WHILE???? cannot find text undefined. 
        console.log("\n=============")
        console.log("Tweet: " + tweets.statuses[i].text)
        console.log("\nSent at: " + tweets.statuses[i].created_at)
        console.log("=============\n")
        var twitterInfo = tweets.statuses[i].text + " " + tweets.statuses[i].created_at;
        writeToLog(twitterInfo); 
        };
    };    
 });
}; //end of getTweet function

function getSong(trackName) { 
// search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
spotify.search({ type: 'track', query: trackName, limit: 1, popularity: 80 }, function(err, data) {
    if (!err) {
        var spot = data.tracks.items[0]; 
        console.log("\n=============\n");
        console.log("Artist: " + spot.album.artists[0].name); 
        console.log("Release Date: " + spot.album.release_date);
        console.log("Album Name: " + spot.name); 
        console.log("External URL: " + spot.album.artists[0].href);
        console.log("\n=============\n");
        var spotifyInfo = " || " + spot.album.artists[0].name + " " +  spot.album.release_date + " " + spot.name + " " + spot.album.artists[0].href + " ";
        writeToLog(spotifyInfo); 
    } else { 
            console.log("error occured: " + err); 
        }
    });  //spotify.search close bracket
}// end of getSong function; 

function getMovie(movieName) { 
request(movieName, function(err, movies, body) { 
    if(!err) {         
        var omdbInput = JSON.parse(body);
        console.log("\n==========\n"); 
        console.log("Movie Title: " + omdbInput.Title); 
        console.log("Release Date: " + omdbInput.Released);
        console.log("IMDB Rating: " + omdbInput.imdbRating);
        console.log("Rotten Tomatoes Rating: " + omdbInput.Ratings[1].Value);
        console.log("Produced in: " + omdbInput.Country);
        console.log("Language: " + omdbInput.Language);
        console.log("\nPlot: " + omdbInput.Plot + "\n"); 
        console.log("Starring: " + omdbInput.Actors);
        console.log("\n==========\n")

    } else console.log(err); 
    })
} //end of getMovie function 

if (input[2] === validateTwitter) { 
    getTweets(); 
} else if (input[2] === validateSpotify) {
    trackName = string; 
    console.log("track name: " + trackName); 
    getSong(trackName); 
} else if (input[2] === validateOmdb) { 
    movieName = "http://www.omdbapi.com/?t=" + string + "&y=&plot=short&apikey=trilogy";
    getMovie(movieName); 
} else if (input[2] === validateRandom) {
    fs.readFile("random.txt", "utf8", function(err, data) { 
        if (!err) { 
            var dataArr = data.split(","); 
            movieName = dataArr[1]; 
            getSong(movieName); 
        } 
    })
} else if (input[2] === validateOmdb && string === "") { 
    movieName = "http://www.omdbapi.com/?t=mr%20nobody&y=&plot=short&apikey=trilogy";
    getMovie(movieName); 

}
function writeToLog(writeInput) {
    fs.appendFile("log.txt", "\n" + writeInput, function(err) {
        if (err) {
            console.log("writeToLog Error: " + err)
        } else { 
            console.log("log.txt was updated")
        }
    }); 
}
//things that still need to be completed: 
//1. I need to do the bonus - log to log.txt
//2. i also need to make sure my twitter function is complete. 
//3. find a way to get the validateOmdb if there is no input. 
//4. if time, confirm the song is the one you were looking for. 


