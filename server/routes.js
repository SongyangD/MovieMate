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
//   const name = '168Club';
//   const pennKey = 'team168';


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
// const movies = async function(req, res) {
//   const page = parseInt(req.query.page) || 1;
//   const pageSize = parseInt(req.query.page_size) || 20;
//   const offset = (page - 1) * pageSize;
//   var query = `
//     SELECT *
//     FROM movie_data
//     ORDER BY year DESC
//     LIMIT ${offset}, ${pageSize};
//   `;
//   connection.query(query, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({}); 
//     } else {
//       res.json(data);
//     }
//   });
// }

// Route 2: GET /movies/:movie_id
// const movie = async function(req, res) {
//   const movie_id = req.params.movie_id;
//   connection.query(`
//     SELECT *
//     FROM movie_data
//     WHERE imdb_title_id = '${movie_id}'
//     `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({}); // replace this with your implementation
//     } else {
//       res.json(data[0]);
//     }
//   });
// }

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

/********************
 * MOVIE ROUTES *
 ********************/
// Sydu
// Route 1: GET /movies
const movies = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
  var query = `
    SELECT *
    FROM movie_data
    ORDER BY year desc
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

// Sydu
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
      res.json({}); 
    } else {
      res.json(data);
    }
  });
}

// Sydu
// Route 3: GET /search_movies
// return a list of movies that 
const search_movies = async function(req, res) {
  const title = req.query.title ?? '';
  const yearLow = req.query.year_low ?? 1900;
  const yearHigh = req.query.year_high ?? 2023;
  const country = req.query.country ?? '';
  const language = req.query.language ?? '';
  const genre = req.query.genre ?? '';
  const isOscar = req.query.isOscar === 'true' ? 1 : 0;
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

  var query2 = `
    SELECT *
    FROM movie_data
    WHERE title LIKE '%${title}%'
    AND year BETWEEN ${yearLow} AND year <= ${yearHigh} 
    AND genre LIKE '%${genre}%' 
    AND country LIKE '%${country}%' 
    AND language LIKE '%${language}%'
    ORDER BY year DESC
    LIMIT ${offset}, ${pageSize};
  `;
  if (isOscar){
    connection.query(query1, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({}); 
      } else {
        res.json(data);
      }
    });
  }else{
    connection.query(query2, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
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
      res.json(data);
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

/************************************************
 ******************  Oscar  *********************
 ***********************************************/

// Query 10: all actresses in the best picture nominated movies
// 演员页
// app.get('/oscar', routes.search_oscar_people)
const search_oscar_people = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;

  var query1 = `
    SELECT *
    FROM people P, oscar O, movie_people MP
    WHERE O.category = "BEST PICTURE" and O.imdb_title_id = MP.imdb_title_id and MP.imdb_name_id = P.imdb_name_id;
    ORDER BY name ASC
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
 
// Query 12: GET / search_oscar_filter
// 奥斯卡页主体

const search_oscar_filter = async function(req, res) {
  
  //输入 1) no title, language, 2) no title, no language, 3) title, language, 4) title, no language
  // 4 个组合 vs 语言必须
  const title = req.query.title ?? '';
  const language = req.query.language ?? '';
  
  //滑杆 duration / year 
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 66000;
  
 
  var query_title = `
      SELECT *
      FROM Oscar O, movie_data M    
      WHERE title LIKE '%${title}%'  
            AND duration <= ${durationHigh} AND duration >= ${durationLow}
            AND language LIKE '%${language}$%'
            ORDER BY M.title
  `;

  var query_no_title =`
      SELECT *
      FROM Songs
      WHERE duration <= ${durationHigh} AND duration >= ${durationLow}
            AND language LIKE '%${language}$%'
      ORDER BY M.title
`;

  // if title empty
  if(title === ''){
    connection.query(query_no_title, function(err, data){
      if(err){
        console.log(err);
        res.json({});
      } else if(data.length == 0){ // no match 
        res.json([]);
      } else{
        console.log(data);
        res.json(data);
      }
    })
  } else { // if title 
    connection.query(query_title, function(err, data){
      if(err){
        console.log(err);
        res.json({});
      }else if(data.length == 0){ // no match 
        res.json([]);
      }else{
        console.log(data);
        res.json(data);
      }
    }) 
  }
}



// Query 13 
// return a list of movie with sepcific language/country/year etc and won any Oscar awards
const search_won= async function(req, res) {
  // const page = parseInt(req.query.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 20;
  // const offset = (page - 1) * pageSize;
  const duration= req.query.duration_low ?? 60;
  const language= req.query.language ?? '';

  var query = `
  SELECT *
  FROM movie_data M
  WHERE M.duration > '${duration}$' AND M.language = '${language}$' and M.imdb_title_id IN (SELECT O.imdb_title_id
                                               FROM oscar O
                                               WHERE O.winner = True);
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



///search_movies_year/:year
// Query 14 略重复 query 3: return all movies's title/country/language that were released in a particular year X
const search_movies_year = async function(req, res) {
  const year= req.query.year ?? '';

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;

  var query1 = `
  SELECT M.title, group_concat(M.country order by M.country ASC, ', ')   AS Country
  FROM movie_data M
  WHERE year = ${year} 
  GROUP BY M.title
  ORDER BY M.title;
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


// Query15 Find the top 10 directors who have directed the most movies
// that were nominated for an Oscar, along with the number of nominations
// their movies have received, and the number of movies they directed overall

// Route 4: GET /top_oscar_director
const top_oscar_directors = async function(req, res) {

  var query = `
  SELECT m.director, COUNT(*) AS num_nominations, COUNT(DISTINCT m.imdb_title_id) AS num_movies
  FROM movie_data m
  INNER JOIN oscar o ON m.imdb_title_id = o.imdb_title_id
  WHERE m.Oscar_nominated = TRUE
  GROUP BY m.director
  ORDER BY num_nominations DESC
  LIMIT 10;
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


// Query 16: 静态页面 /stats
  const oscar_decade = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;

  var query = `
  with table_x as (SELECT p.name, COUNT(*) AS num_nominations, CONCAT((m.year DIV 10) * 10, '-', (m.year DIV 10) * 10 + 9) AS decade
  FROM people p
  INNER JOIN movie_people mp ON p.imdb_name_id = mp.imdb_name_id
  INNER JOIN movie_data m ON mp.imdb_title_id = m.imdb_title_id
  INNER JOIN oscar o ON m.imdb_title_id = o.imdb_title_id
  WHERE mp.category = 'actor' AND m.Oscar_nominated = TRUE
  GROUP BY p.imdb_name_id, decade
  HAVING COUNT(*) = (
      SELECT COUNT(*)
      FROM people p2
      INNER JOIN movie_people mp2 ON p2.imdb_name_id = mp2.imdb_name_id
      INNER JOIN movie_data m2 ON mp2.imdb_title_id = m2.imdb_title_id
      INNER JOIN oscar o2 ON m2.imdb_title_id = o2.imdb_title_id
      WHERE p.imdb_name_id = p2.imdb_name_id AND m2.Oscar_nominated = TRUE AND CONCAT((m2.year DIV 10) * 10, '-', (m2.year DIV 10) * 10 + 9) = decade
  )
  ORDER BY decade ASC)
  select name, max(num_nominations) num_nominations, decade
  from table_x
  group by decade;
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



// Route 6: GET /album_songs/:album_id
// const album_songs = async function(req, res) {
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
// Route 10: GET /movie_people/:movie_id
// const movie_people = async (req, res) => {
//   const movie_id = req.params.movie_id;
//   const page = parseInt(req.params.page) || 1;
//   const pageSize = parseInt(req.query.page_size) || 20;
//   const offset = (page - 1) * pageSize;
//   var query = `
//   SELECT P.*
//   FROM movie_data M, movie_people MP, people P
//   WHERE M.imdb_title_id = MP.imdb_title_id 
//   AND MP.imdb_name_id = P.imdb_name_id 
//   AND M.imdb_title_id = '${movie_id}'
//   LIMIT ${offset}, ${pageSize};
//   `;
//   connection.query(query, (err, data) => {
//   if (err || data.length === 0) {
//     console.log(err);
//     res.json({}); 
//   } else {
//     res.json(data);
//   }
// });
// }

// Route 7: GET /top_songs

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


// Route 8: GET /top_albums

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
  oscarMovieRecommended,
  recent10genre,
  top10language,
  search_oscar_people,
  search_oscar_filter,
  search_won,
  search_movies_year,
  top_oscar_directors,
  oscar_decade,
}