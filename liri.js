
require("dotenv").config();

var keys = require("./key.js");
var request = require("request")
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
var moment = require('moment');
moment().format();
var fs = require('fs');

var command = process.argv[2];
var input = process.argv[3];

//commands
var ask = function (commands, newData){
    switch(commands) {
        case "concert-this":
            concertThis(newData);
            break;
        case "movie-this" :
            movieThis(newData);
            break;    
        case 'spotify-this-song':
            spotifyThis(newData); 
            break;
        case 'do-what-it-says':
            doWhatItSays(); 
            break;
        default:
        console.log("Invalid command. Please try again");
    }
};

// CONCERT FUNCTION

function concertThis(bandQuery) {

    var bandQuery = process.argv.slice(3).join(" ");

    var queryUrl = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=codingbootcamp";

    request(queryUrl, function (error, response, body) {
        
        if (!error && response.statusCode === 200) {

            var concertData = JSON.parse(body);

            var momentDT = moment().format('L');

            console.log("===============================");
            // * Name of the venue
            console.log("Venue Name : " + concertData[0].venue.name +
                // * Venue location
                "\nVenue Location: " + concertData[0].venue.city + "," + concertData[0].venue.country +
                //  * Date of the Event (use moment to format this as "MM/DD/YYYY")
                "\nDate of the Event: " + momentDT +
                "\n===============================");
            
        };
    });
}
//  SPOTIFY FUNCTION
function spotifyThis(musicSearch) {

    var musicSearch = process.argv.slice(3).join(" ");
    //console.log(musicSearch);

    if (musicSearch === undefined || null) {
        musicSearch = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: musicSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
                    
        else {
            for (i = 0; i < data.tracks.items.length && i < 5; i++){
            
                var musicQuery = data.tracks.items[i];
                // console.log("===============================");
                 // * Artist(s)
                console.log("Artist: " + musicQuery.artists[0].name +
                // * The song's name
                "\nSong Name: " + musicQuery.name +
                //* A preview link of the song from Spotify
                "\nLink to Song: " + musicQuery.preview_url +
                //* The album that the song is from
                "\nAlbum Name: " + musicQuery.album.name +
                "\n===============================");
                /*fs.appendFile("log.txt", musicSearch, function(err) {
                    if (err) throw err;
                    
                  });*/
            }
        };  
    });
}
    // MOVIE FUNCTION
function movieThis (movieQuery) {
   
    var movieQuery = process.argv.slice(3).join(" ");
 
    // * If the user doesn't type a movie in, the program will output data for the movie 'Mr.Nobody.'
     if (movieQuery === undefined || null) {
            movieQuery = "Mr.Nobody";
        }
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) { 
        
       if (!error && response.statusCode === 200) {      
           // JSON.parse for legibility
            var movieData = JSON.parse(body);
                                   
            // for (i = 0; i < movieData.length && i < 5; i++) {
                console.log("===============================");
            // * Title of the movie.              
                console.log("Movie Title: " + movieData.Title +
            // * Year the movie came out.
                "\nYear: " + movieData.released +
            // * IMDB Rating of the movie.
                "\nIMDB Rating: " + movieData.imdbRating +
            // * Rotten Tomatoes Rating of the movie.
                "\nRotten Tomatoes Rating: " + movieData.tomatoeRating +
            // * Country where the movie was produced.
                "\nCountry: " + movieData.Country +
            // * Language of the movie.
                "\nLanguage: " + movieData.Language +
            // * Plot of the movie.
                "\nPlot: " + movieData.Plot +
            // * Actors in the movie.
                "\nActors & Actresses: " + movieData.Actors +
                "\n===============================");             
            // };
           /* fs.appendFile("log.txt", movieData, function(err) {
                if (err) throw err;
                
              }); */
        };
    }); 
}





//Do what it says reads text from random.txt file, command is ran
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;
            var randomText = data.split(",");
        
        if (randomText.length == 2) {
            ask(randomText[0], randomText[1]);
        }
        else if (randomText.length == 1) {
            ask(randomText[0]);
        }
    });
}

ask (command, input);