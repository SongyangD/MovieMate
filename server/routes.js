const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
// const author = async function(req, res) {
//   // TODO (TASK 1): replace the values of name and pennKey with your own
//   const name = 'Shengyin Si';
//   const pennKey = 'sisy';

//   // checks the value of type the request parameters
//   // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
//   if (req.params.type === 'name') {
//     // res.send returns data back to the requester via an HTTP response
//     res.send(`Created by ${name}`);
//   } else if (req.params.type === 'pennkey') {
//     // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
//     res.send(`Created by ${pennKey}`);
//   } else {
//     // we can also send back an HTTP status code to indicate an improper request
//     res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
//   }
// }

// Route 2: GET /random
// const random = async function(req, res) {
//   // you can use a ternary operator to check the value of request query values
//   // which can be particularly useful for setting the default value of queries
//   // note if users do not provide a value for the query it will be undefined, which is falsey
//   const explicit = req.query.explicit === 'true' ? 1 : 0;

//   // Here is a complete example of how to query the database in JavaScript.
//   // Only a small change (unrelated to querying) is required for TASK 3 in this route.
//   connection.query(`
//     SELECT *
//     FROM Songs
//     WHERE explicit <= ${explicit}
//     ORDER BY RAND()
//     LIMIT 1
//   `, (err, data) => {
//     if (err || data.length === 0) {
//       // if there is an error for some reason, or if the query is empty (this should not be possible)
//       // print the error message and return an empty object instead
//       console.log(err);
//       res.json({});
//     } else {
//       // Here, we return results of the query as an object, keeping only relevant data
//       // being song_id and title which you will add. In this case, there is only one song
//       // so we just directly access the first element of the query results array (data)
//       // TODO (TASK 3): also return the song title in the response
//       res.json({
//         song_id: data[0].song_id,
//         title: data[0].title
//       });
//     }
//   });
// }


// Route 3: GET /song/:song_id
// const song = async function(req, res) {
//   // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
//   // Most of the code is already written for you, you just need to fill in the query
//   const song_id = req.params.song_id;
//   connection.query(`
//     SELECT *
//     FROM Songs
//     WHERE song_id = '${song_id}'
//     `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data[0]);
//     }
//   });
// }
/********************************
 *  MOVIES ROUTES *
 ********************************/
// Route 1: GET /movies
const movies = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
  var query = `
    SELECT *
    FROM movie_data
    ORDER BY year DESC
    LIMIT ${offset}, ${pageSize};
  `;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data);
    }
  });
}

// Route 2: GET /movies/:movie_id
const movie = async function(req, res) {
  const movie_id = req.params.movie_id;
  connection.query(`
    SELECT *
    FROM movie_data
    WHERE imdb_title_id = '${movie_id}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); // replace this with your implementation
    } else {
      res.json(data[0]);
    }
  });
}

//Homepage: recommend an oscar winning movie to the user
const oscarMovieRecommended = async function (req,res){

  var query = `
  WITH random_movie AS (
    SELECT imdb_title_id
    FROM oscar
    WHERE winner = true
    ORDER BY RAND()
    LIMIT 1
  )
  SELECT
    md.title,
    md.poster_url,
    md.description,
    COUNT(o.imdb_title_id) AS num_nominations,
    md.year,
    md.duration,
    p.name AS director_name
  FROM movie_data AS md
  JOIN oscar AS o
  ON md.imdb_title_id = o.imdb_title_id
  JOIN random_movie
  ON md.imdb_title_id = random_movie.imdb_title_id
  JOIN movie_people AS mp
  ON md.imdb_title_id = mp.imdb_title_id
    AND mp.category = 'director'
  JOIN people AS p
  ON mp.imdb_name_id = p.imdb_name_id
  GROUP BY md.title,
  md.poster_url,
  md.description,
  md.year,
  md.duration,
  director_name
  LIMIT 1;  
  `
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


const  recent10genre = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const genre = req.params.genre;

  var query = `
  SELECT title, poster_url, description
    FROM movie_data
    WHERE genre Like '%${genre}%'
    Order by year DESC, votes DESC
    LIMIT 10
  `
  connection.query(query,(err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const  top10language = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const language = req.params.language;

  var query = `
  SELECT title, poster_url, description
    FROM movie_data
    WHERE language Like '%${language}%'
    Order by avg_vote DESC
    LIMIT 10
  `
  connection.query(query,(err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const song_id = req.params.song_id;
  connection.query(`
    SELECT *
    FROM movie_data
    WHERE imdb_title_id = '${movie_id}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); // replace this with your implementation
    } else {
      res.json(data[0]);
    }
  });
}

// Sydu
// Route 3: GET /search_movies
const search_movies = async function(req, res) {
  const title = req.query.title ?? '';
  const yearLow = req.query.year_low ?? 1900;
  const yearHigh = req.query.year_high ?? 2023;
  const country = req.query.country ?? '';
  const language = req.query.language ?? '';
  const genre = req.query.genre ?? '';
  const isOscar = req.query.Oscar_nominated === 'true' ? 1 : 0;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;

  var query1 = `
    SELECT *
    FROM movie_data
    WHERE title LIKE '%${title}%'
    AND Oscar_nominated = ${isOscar} 
    AND year BETWEEN ${yearLow} AND year <= ${yearHigh} 
    AND genre LIKE '%${genre}%' 
    AND country LIKE '%${country}%' 
    AND language LIKE '%${language}%'
    ORDER BY year DESC
    LIMIT ${offset}, ${pageSize};
  `;

  connection.query(query1, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data);
    }
  });
}

// Route 4: GET /top20_movies
const top20_movies = async function(req, res) {
  // const page = parseInt(req.query.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 20;
  // const offset = (page - 1) * pageSize;
  const genre = req.query.genre ?? '';

  var query = `
    SELECT *
    FROM movie_data
    WHERE genre LIKE '%${genre}%'
    ORDER BY avg_vote DESC
    LIMIT 20;
  `;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data);
    }
  });
}

/************************
 * PEOPLE ROUTES *
 ************************/

// Route 5: GET /people
const people = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
  var query = `
    SELECT *
    FROM people
    ORDER BY name ASC
    LIMIT ${offset}, ${pageSize};
  `;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /people/:person_id
const person = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const person_id = req.params.person_id;
  connection.query(`
    SELECT *
    FROM people
    WHERE imdb_name_id = '${person_id}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data[0]);
    }
  });
}

// Route 7: GET /search_people
const search_people = async function(req, res) {
  const name = req.query.name ?? '';
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;

  var query1 = `
    SELECT *
    FROM people
    WHERE name LIKE '%${name}%'
    ORDER BY name ASC
    LIMIT ${offset}, ${pageSize};
  `;

  connection.query(query1, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); // replace this with your implementation
    } else {
      res.json(data);// replace this with your implementation
    }
  });
}

/************************
 * OSCAR ROUTES *
 ************************/

// Route 8: GET /oscar_movies
const oscar_movies = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
  var query = `
    SELECT *
    FROM Albums
    ORDER BY release_date desc
    LIMIT ${offset}, ${pageSize};
  `;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data);
    }
  });
}

// Route 9: GET /search_oscar_winner
// return all movie info of the oscar winner by some criteria
const search_oscar_winner = async function(req, res) {
  const country = req.query.country ?? '';
  const language = req.query.language ?? '';
  const genre = req.query.genre ?? '';
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;

  var query1 = `
  SELECT *
  FROM oscar O, movie_data M 
  WHERE genre LIKE '%${genre}%' 
  AND country LIKE '%${country}%' 
  AND language LIKE '%${language}%'
  AND M.imdb_title_id IN 
    (SELECT O.imdb_title_id
    FROM oscar O 
    WHERE O.winner = True)  
  LIMIT ${offset}, ${pageSize};
  `;

  connection.query(query1, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); // replace this with your implementation
    } else {
      res.json(data);// replace this with your implementation
    }
  });
}

// Route 10: GET /oscar_ranking
// movies with highest number of nomination to lowest
const oscar_ranking = async function(req, res){
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
// oscar table doesn't have a film name field, need to see if we need it.
  connection.query(`
  SELECT imdb_title_id, COUNT(imdb_title_id)AS Frequency
  FROM oscar
  GROUP BY imdb_title_id
  ORDER BY Frequency DESC
  LIMIT ${offset}, ${pageSize};
  `, (err, data) => {
    if (err || data.length === 0 ){
      console.log(err);
      res.json({});
    }else{
      res.json(data);
    }
  });
}

// Route 6: GET /album_songs/:album_id
// const album_songs = async function(req, res) {
//   // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
//   const album_id = req.params.album_id;
//   var query = `
//     SELECT a.song_id, a.title, a.number, a.duration, a.plays
//     FROM Songs a
//     JOIN Albums b
//     ON a.album_id = b.album_id
//     WHERE a.album_id = '${album_id}'
//     ORDER BY number;
//   `;
//   connection.query(query, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({}); // replace this with your implementation
//     } else {
//       res.json(data);// replace this with your implementation
//     }
//   });
// }

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 11: GET /movie_count
// return a the total number of movies by selected criteria
const movie_count = async function(req, res) {
  const country = req.query.country ?? '';
  const language = req.query.language ?? '';
  const genre = req.query.genre ?? '';
  const year = req.query.year;

   var query1 =`
   SELECT COUNT(imdb_title_id) as num
   FROM movie_data
   WHERE genre LIKE '%${genre}%' 
   AND country LIKE '%${country}%' 
   AND language LIKE '%${language}%'
   AND year = ${year};
   `;

   var query2 =`
   SELECT COUNT(imdb_title_id) as num
   FROM movie_data
   WHERE genre LIKE '%${genre}%' 
   AND country LIKE '%${country}%' 
   AND language LIKE '%${language}%';
   `;

   if(year){
    connection.query(query1, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    });
   }else{
    connection.query(query2, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    });
   } 
}

// Route 12: GET /avg_vote_person/:person_id
//Average Vote (multiple tables): return the averge vote of the given actor's movies.
const avg_vote_person = async function(req, res){
  const person_id = req.params.person_id;

  var query = `
  SELECT round(AVG(M.avg_vote),2) as avg_rating
  FROM movie_data M, movie_people MP, people P
  WHERE M.imdb_title_id = MP.imdb_title_id 
  AND MP.imdb_name_id = P.imdb_name_id 
  AND P.imdb_name_id = '${person_id}';
  `
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data[0]);
    }
  });
};

// Route 13:/movie_people/:movie_id
// return a list actors in the given movies
const movie_people = async function (req, res) {
  const movie_id = req.params.movie_id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;

  connection.query(`
    SELECT P.*
    FROM movie_data M, movie_people MP, people P
    WHERE M.imdb_title_id = MP.imdb_title_id 
    AND MP.imdb_name_id = P.imdb_name_id 
    AND M.imdb_title_id = '${movie_id}'
    LIMIT ${offset}, ${pageSize};
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({}); 
    } else {
      res.json(data);
    }
  });
}


// Route: GET /top_songs
// const top_songs = async function(req, res) {
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ? req.query.page_size : 10;
//   const offset = (page - 1) * pageSize;
//   var query1 = `
//     SELECT a.song_id, a.title, a.album_id, b.title as album, a.plays
//     FROM Songs a
//     LEFT JOIN Albums b
//     ON a.album_id = b.album_id
//     ORDER BY plays desc; 
//   `;

//   var query2 = `
//     SELECT a.song_id, a.title, a.album_id, b.title as album, a.plays
//     FROM Songs a
//     LEFT JOIN Albums b
//     ON a.album_id = b.album_id
//     ORDER BY a.plays desc
//     LIMIT ${pageSize} OFFSET ${offset}
//     ;
//   `;

//   if (!page) {
//     // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//     // Hint: you will need to use a JOIN to get the album title as well
//     connection.query(query1, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({}); // replace this with your implementation
//       } else {
//         res.json(data);// replace this with your implementation
//       }
//     });
//   } else {
//     // TODO (TASK 10): reimplement TASK 9 with pagination
//     // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//     connection.query(query2, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({}); // replace this with your implementation
//       } else {
//         res.json(data);// replace this with your implementation
//       }
//     });
//   }
// }

// Route: GET /top_albums
// const top_albums = async function(req, res) {
//   // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
//   // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ? req.query.page_size : 10;

//   var query1 = `
//     SELECT a.album_id, a.title, sum(b.plays) as plays
//     FROM Albums a
//     LEFT JOIN Songs b
//     ON a.album_id = b.album_id
//     GROUP BY a.album_id, a.title
//     ORDER BY plays desc;
//   `;

//   var query2 = `
//     SELECT a.album_id, a.title, sum(b.plays) as plays
//     FROM Albums a
//     LEFT JOIN Songs b
//     ON a.album_id = b.album_id
//     GROUP BY a.album_id, a.title
//     ORDER BY plays desc
//     LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
//   `;

//   if (!page) {
//     // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//     // Hint: you will need to use a JOIN to get the album title as well
//     connection.query(query1, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({}); // replace this with your implementation
//       } else {
//         res.json(data);// replace this with your implementation
//       }
//     });
//   } else {
//     // TODO (TASK 10): reimplement TASK 9 with pagination
//     // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//     connection.query(query2, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({}); // replace this with your implementation
//       } else {
//         res.json(data);// replace this with your implementation
//       }
//     });
//   }
// }

// Route 9: GET /search_albums
// const search_songs = async function(req, res) {
//   // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
//   // Some default parameters have been provided for you, but you will need to fill in the rest
//   const title = req.query.title ?? '';
//   const durationLow = req.query.duration_low ?? 60;
//   const durationHigh = req.query.duration_high ?? 660;
//   const playsLow = req.query.plays_low ?? 0;
//   const playsHigh = req.query.plays_high ?? 1100000000;
//   const danceabilityLow = req.query.danceability_low ?? 0;
//   const danceabilityHigh = req.query.danceability_high ?? 1;
//   const energyLow = req.query.energy_low ?? 0;
//   const energyHigh = req.query.energy_high ?? 1;
//   const valenceLow = req.query.valence_low ?? 0;
//   const valenceHigh = req.query.valence_high ?? 1;
//   const explicit = req.query.explicit === 'true' ? 1 : 0;

//   var query1 = `
//     SELECT song_id, album_id, title, number,
//     duration, plays, danceability, energy, valence, tempo, key_mode, explicit
//     FROM Songs 
//     WHERE explicit <= ${explicit} AND title LIKE '%${title}%' AND duration >= ${durationLow} AND duration <= ${durationHigh} 
//     AND  plays >= ${playsLow} AND plays <= ${playsHigh} AND danceability >= ${danceabilityLow} AND danceability <= ${danceabilityHigh}
//     AND  energy >= ${energyLow} AND energy <= ${energyHigh} AND valence >= ${valenceLow} AND valence <= ${valenceHigh}
//     ORDER BY title;
//   `;

//   connection.query(query1, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({}); // replace this with your implementation
//     } else {
//       res.json(data);// replace this with your implementation
//     }
//   });
// }

module.exports = {
  movie,
  movies,
  search_movies,
  person,
  people,
  search_people,
  oscar_movies,
  search_oscar_winner,
  movie_people,
  top20_movies,
  movie_count,
  oscar_ranking,
  avg_vote_person,
  // author,
  // random,
  // song,
  // album_songs,
  // top_songs,
  // top_albums,
  // album,
  // albums,
  // search_songs,
  oscarMovieRecommended,
  recent10genre,
  top10language,
}
