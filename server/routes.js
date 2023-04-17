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
const author = async function(req, res) {
  const name = '168Club';
  const pennKey = 'team168';


  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

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
    ORDER BY votes DESC, year DESC;
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
  // const page = parseInt(req.query.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 20;
  // const offset = (page - 1) * pageSize;

  var query1 = `
    SELECT *
    FROM movie_data
    WHERE title LIKE '%${title}%'
    AND Oscar_nominated = ${isOscar} 
    AND year BETWEEN ${yearLow} AND ${yearHigh} 
    AND genre LIKE '%${genre}%' 
    AND country LIKE '%${country}%' 
    AND language LIKE '%${language}%'
    ORDER BY year DESC;
  `;

  var query2 = `
    SELECT *
    FROM movie_data
    WHERE title LIKE '%${title}%'
    AND year BETWEEN ${yearLow} AND ${yearHigh} 
    AND genre LIKE '%${genre}%' 
    AND country LIKE '%${country}%' 
    AND language LIKE '%${language}%'
    ORDER BY year DESC;
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

// Route 4: GET /movie_people/:movie_id
const movie_people = async (req, res) => {
  const movie_id = req.params.movie_id;
  const page = parseInt(req.params.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
  var query = `
  SELECT P.name, P.imdb_name_id, P.photo_url
  FROM movie_data M, movie_people MP, people P
  WHERE M.imdb_title_id = MP.imdb_title_id 
  AND MP.imdb_name_id = P.imdb_name_id 
  AND M.imdb_title_id = '${movie_id}'
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
/************************
 * HOMEPAGE ROUTES *
 ************************/
// Route 5: GET /oscar_recommend
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
    md.imdb_title_id,
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

// Route 6: GET /recent10genre/:genre
const recent10genre = async function(req, res) {
  // Most of the code is already written for you, you just need to fill in the query
  const genre = req.params.genre;

  var query = `
  SELECT title, poster_url, description, imdb_title_id
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

// Route 7: GET /top10language/:language
const top10language = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const language = req.params.language;

  var query = `
  SELECT title, poster_url, description, imdb_title_id
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


/************************
 * PEOPLE ROUTES *
 ************************/

// Route 8: GET /people
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

// Route 9: GET /people/:person_id
const person = async function(req, res) {
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

// Route 10: GET /search_people
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

// Route 11: GET /avg_vote_person/:person_id
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

//Route 12: GET/related_actors/:id
const related_actors = async function (req, res) {
  const person_id = req.params.id
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
  var query = `WITH X_movies AS(
    SELECT M.imdb_title_id,M.title
    FROM movie_people MP JOIN movie_data M ON M.imdb_title_id = MP.imdb_title_id
               JOIN people P ON MP.imdb_name_id = P.imdb_name_id
    WHERE P.imdb_name_id = '${person_id}'
    ),
 
 
 coActors1 AS (
    SELECT DISTINCT P.imdb_name_id AS id, P.name AS name, P.photo_url
    FROM movie_people MP JOIN X_movies XM on XM.imdb_title_id = MP.imdb_title_id
                    JOIN people P ON P.imdb_name_id = MP.imdb_name_id
    WHERE MP.imdb_name_id != '${person_id}'
    ),
 
 
 co1movies AS(
     SELECT DISTINCT MP.imdb_title_id
     FROM movie_people MP JOIN coActors1 C1 ON C1.id = MP.imdb_name_id
    ),
 
 
 coActors2 AS (
    SELECT DISTINCT P.imdb_name_id AS id, P.name AS name, P.photo_url
    FROM movie_people MP JOIN co1movies C1 ON C1.imdb_title_id = MP.imdb_title_id
                    JOIN people P ON P.imdb_name_id = MP.imdb_name_id
    WHERE
    P.imdb_name_id != '${person_id}'
    AND
    MP.imdb_name_id NOT IN (SELECT coActors1.id FROM  coActors1)
    ),
 
 co2movies AS(
     SELECT DISTINCT MP.imdb_title_id
     FROM movie_people MP JOIN coActors2 C2 ON C2.id = MP.imdb_name_id
    ),
 
 
 coActors3 AS (
    SELECT DISTINCT MP.imdb_name_id AS id, MC.name AS name, MC.photo_url
    FROM movie_people MP JOIN co2movies C2 ON C2.imdb_title_id = MP.imdb_title_id
                    JOIN people MC ON MC.imdb_name_id = MP.imdb_name_id
    WHERE
        MC.imdb_name_id != '${person_id}'
        AND
        MC.imdb_name_id NOT IN (SELECT coActors2.id FROM coActors2)
        AND
        MC.imdb_name_id NOT IN (SELECT coActors1.id FROM  coActors1)
    ),
 
 actoerTable1 AS(
    SELECT name, id, photo_url
    from coActors1
    UNION
    SELECT name, id, photo_url from coActors2
 )
 SELECT name, id, photo_url
 FROM actoerTable1
 UNION
 SELECT name, id, photo_url from coActors3
 LIMIT ${offset}, ${pageSize};
 `
  connection.query(
 query, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
};

// Route 13: GET /top10_rated_oscar_movies
const top10_rated_oscar_movies = async function(req, res) {
  // const page = parseInt(req.query.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 20;
  // const offset = (page - 1) * pageSize;
  var query = `
  SELECT  *
  FROM movie_data
  WHERE Oscar_nominated = True
  Order by avg_vote DESC
  limit 10;
  `;
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
 };
 

/************************
 * OSCAR ROUTES *
 ************************/

// Route 14: all actresses in the best picture nominated movies
// 演员页  app.get('/oscar', routes.search_oscar_people)
const search_oscar_people = async function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
 
  var query1 = `
    SELECT *
    FROM people P, oscar O, movie_people MP
    WHERE O.category = "BEST PICTURE" and O.imdb_title_id = MP.imdb_title_id and MP.imdb_name_id = P.imdb_name_id
    ORDER BY P.name ASC
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
};
 
// Route 15: GET / search_oscar_filter
// 奥斯卡页主体
const search_oscar_filter = async function(req, res) {
 
  //输入 1) no title, language, 2) no title, no language, 3) title, language, 4) title, no language
  // 4 个组合 vs 语言必须
  const title = req.query.title ?? '';
  const language = req.query.language ?? '';
 
  //滑杆 duration / year
  const durationLow = req.query.duration_low ?? 0;
  const durationHigh = req.query.duration_high ?? 600;
 
  var query_title = `
      SELECT *
      FROM oscar O, movie_data M    
      WHERE M.title LIKE '%${title}%'  
            AND M.duration <= ${durationHigh} AND M.duration >= ${durationLow}
            AND M.language LIKE '%${language}%'
            AND O.imdb_title_id = M.imdb_title_id
      Order By M.title;
         
  `;


  var query_no_title =`
      SELECT *
      FROM oscar O, movie_data M
      WHERE M.duration <= ${durationHigh} AND M.duration >= ${durationLow}
            AND M.language LIKE '%${language}%'
            AND O.imdb_title_id = M.imdb_title_id
      Order by M.title;
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
        // console.log(data);
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

// Route 16: GET /search_won 
// return a list of movie with specific language/country/year etc and won any Oscar awards
const search_won= async function(req, res) {
  // const page = parseInt(req.query.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 20;
  // const offset = (page - 1) * pageSize;
  const duration= req.query.duration_low ?? 60;
  const language= req.query.language ?? '';

  var query = `
  SELECT *
  FROM movie_data M
  WHERE M.duration > ${duration} 
  AND M.language LIKE '%${language}%' 
  and M.imdb_title_id 
  IN 
  (SELECT O.imdb_title_id
  FROM oscar O
  WHERE O.winner = true);
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

// Route 17: GET /top_oscar_director
// Find the top 10 directors who have directed the most movies
// that were nominated for an Oscar, along with the number of nominations
// their movies have received, and the number of movies they directed overall
const top_oscar_director = async function(req, res) {

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

// Route 18: 静态页面 /stats
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
  group by decade
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
};

// Route 19: GET /movie_count
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




/************************
 * ADVANCED INFO ROUTES *
 ************************/
// // Route 4: GET /top20_movies
// const top20_movies = async function(req, res) {
//   // const page = parseInt(req.query.page) || 1;
//   // const pageSize = parseInt(req.query.page_size) || 20;
//   // const offset = (page - 1) * pageSize;
//   const genre = req.query.genre ?? '';

//   var query = `
//     SELECT *
//     FROM movie_data
//     WHERE genre LIKE '%${genre}%'
//     ORDER BY avg_vote DESC
//     LIMIT 20;
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



module.exports = {
  movie,
  movies,
  search_movies,
  person,
  people,
  search_people,
  avg_vote_person,
  related_actors,
  // search_oscar_winner,
  movie_people,
  // top20_movies,
  top10_rated_oscar_movies,
  movie_count,
  oscarMovieRecommended,
  recent10genre,
  top10language,
  search_oscar_people,
  search_oscar_filter,
  top_oscar_director,
  search_won,
  oscar_decade,
}
