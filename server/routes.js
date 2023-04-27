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
const author = async function (req, res) {
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
// Route 2: GET /movies
const movies = async function (req, res) {
  var query = `
    SELECT title, avg_vote, poster_url,imdb_title_id
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

// Route 3: GET /movies/:movie_id
const movie = async function (req, res) {
  const movie_id = req.params.movie_id;
  connection.query(`
    SELECT *
    FROM movie_data
    WHERE imdb_title_id = '${movie_id}'
    `, (err, data) => {
    if (err || data.length === 0) {
      res.json({}); // replace this with your implementation
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /search_movies
// return a list of movies that 
const search_movies = async function (req, res) {
  const title = req.query.title ?? '';
  const yearLow = req.query.year_low ?? 1900;
  const yearHigh = req.query.year_high ?? 2023;
  const country = req.query.country ?? '';
  const language = req.query.language ?? '';
  const genre = req.query.genre ?? '';
  const isOscar = req.query.isOscar === 'true' ? 1 : null;

  var query1 = `
    SELECT title, imdb_title_id, avg_vote, poster_url, year, director, genre, country, language, duration, Oscar_nominated
    FROM movie_data
    WHERE title LIKE '%${title}%'
    AND (${isOscar} IS NULL OR Oscar_nominated = ${isOscar})
    AND year BETWEEN ${yearLow} AND ${yearHigh} 
    AND genre LIKE '%${genre}%' 
    AND country LIKE '%${country}%' 
    AND language LIKE '%${language}%'
    ORDER BY votes DESC, year DESC;
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

// Route 5: GET /movie_people/:movie_id
const movie_people = async (req, res) => {
  const movie_id = req.params.movie_id;
  var query = `
  SELECT P.name, P.imdb_name_id, P.photo_url
  FROM people P
  JOIN movie_people MP ON MP.imdb_name_id = P.imdb_name_id
  WHERE MP.imdb_title_id = '${movie_id}';
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
// Route 6: GET /oscar_recommend
//Homepage: recommend an oscar winning movie to the user
const oscarMovieRecommended = async function (req, res) {
  var query = `
  SELECT md.title, 
  md.poster_url, 
  md.description, 
  md.imdb_title_id, 
  r.num_nominations, 
  md.year, md.duration, 
  p.name AS director_name
FROM (
         SELECT imdb_title_id, COUNT(imdb_title_id) AS num_nominations
         FROM oscar
         WHERE winner = true
         GROUP BY imdb_title_id
     ) AS r
         JOIN movie_data AS md 
         ON md.imdb_title_id = r.imdb_title_id
         JOIN movie_people AS mp 
         ON md.imdb_title_id = mp.imdb_title_id 
         AND mp.category = 'director'
         JOIN people AS p 
         ON mp.imdb_name_id = p.imdb_name_id
ORDER BY RAND(DATE_FORMAT(NOW(), '%Y-%m-%d'))
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

// Route 7: GET /recent10genre/:genre
const recentgenre = async function (req, res) {
  // Most of the code is already written for you, you just need to fill in the query
  const genre = req.params.genre;

  var query = `
  SELECT title, poster_url, description, imdb_title_id
    FROM movie_data
    WHERE genre Like '%${genre}%'
    AND title IS NOT NULL
    AND poster_url IS NOT NULL
    AND description IS NOT NULL
    Order by year DESC, votes DESC
    LIMIT 50
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

// Route 8: GET /toplanguage/:language
const toplanguage = async function (req, res) {
  // Most of the code is already written for you, you just need to fill in the query
  const language = req.params.language;

  var query = `
  SELECT title, poster_url, description, imdb_title_id
    FROM movie_data
    WHERE language Like '%${language}%'
    AND title IS NOT NULL
    AND poster_url IS NOT NULL
    AND description IS NOT NULL
    Order by avg_vote DESC
    LIMIT 50
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


/************************
 * PEOPLE ROUTES *
 ************************/

// Route 9: GET /people  // only show actors with photo poster 
const people = async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 100;
  // const offset = (page - 1) * pageSize;
  // --LIMIT ${offset}, ${pageSize};
  // where p.photo_url is not null
  var query = `
SELECT p.imdb_name_id,p.name, p.photo_url, count(imdb_title_id) movies_actedIn
FROM  movie_people mp join people p on p.imdb_name_id = mp.imdb_name_id
WHERE mp.category IN ('actor', 'director', 'producer') 
group by p.imdb_name_id
ORDER BY movies_actedIn DESC;
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

// Route 10: GET /people/:person_id
const person = async function (req, res) {
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


// Route 11: GET /movie_people_acted/:person_id
const movie_people_acted = async (req, res) => {
  const person_id = req.params.person_id;
  // const page = parseInt(req.params.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 20;
  // const offset = (page - 1) * pageSize;
  var query = `
  SELECT M.title, M.poster_url, M.imdb_title_id
  FROM movie_people MP join movie_data M on  M.imdb_title_id = MP.imdb_title_id 
      
  WHERE MP.imdb_name_id = '${person_id}' and M.avg_vote > 7
  order by M.avg_vote DESC
  limit 20;
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

// Route 12: GET /search_people
const search_people = async function (req, res) {
  const name = req.query.name ?? '';

  var query1 = `
    SELECT *
    FROM people
    WHERE name LIKE '%${name}%'
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


// Route 13: GET /avg_vote_person/:person_id
//Average Vote (multiple tables): return the averge vote of the given actor's movies.
const avg_vote_person = async function (req, res) {
  const person_id = req.params.person_id;

  var query = `
  SELECT round(AVG(M.avg_vote),2) as avg_rating
  FROM movie_data M join  movie_people MP on M.imdb_title_id = MP.imdb_title_id 
  WHERE  MP.imdb_name_id = '${person_id}';
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

//Route 14: GET/related_actors/:id
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



/************************
 * OSCAR ROUTES *
 ************************/

// Route 15: GET / search_oscar_filter
// 奥斯卡页主体
const search_oscar_filter = async function (req, res) {

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


  var query_no_title = `
      SELECT *
      FROM oscar O, movie_data M
      WHERE M.duration <= ${durationHigh} AND M.duration >= ${durationLow}
            AND M.language LIKE '%${language}%'
            AND O.imdb_title_id = M.imdb_title_id
      Order by M.title;
`;


  // if title empty
  if (title === '') {
    connection.query(query_no_title, function (err, data) {
      if (err) {
        console.log(err);
        res.json({});
      } else if (data.length == 0) { // no match
        res.json([]);
      } else {
        // console.log(data);
        res.json(data);
      }
    })
  } else { // if title
    connection.query(query_title, function (err, data) {
      if (err) {
        console.log(err);
        res.json({});
      } else if (data.length == 0) { // no match
        res.json([]);
      } else {
        console.log(data);
        res.json(data);
      }
    })
  }
}

// Route 16: GET /search_won 
const search_won = async function (req, res) {
  // const page = parseInt(req.query.page) || 1;
  // const pageSize = parseInt(req.query.page_size) || 20;
  // const offset = (page - 1) * pageSize;
  // const duration= req.query.duration_low ?? 60;
  const year = req.query.year ?? -1;

  var query_no_year = `
  SELECT DISTINCT M.imdb_title_id, M.title, M.country, O.year_ceremony as year, M.genre, M.avg_vote, O.category, O.winner,O.name
  FROM movie_data M
  JOIN oscar O ON M.imdb_title_id = O.imdb_title_id
  order by O.year_ceremony, O.category;
  `;
  // WHERE O.winner = 1
  var query = `
  SELECT DISTINCT M.imdb_title_id, M.title, M.country, O.year_ceremony as year, M.genre, M.avg_vote, O.category,O.winner,O.name
  FROM movie_data M
  JOIN oscar O ON M.imdb_title_id = O.imdb_title_id
  WHERE (O.year_ceremony = ${year} OR ${year} IS NULL)
  order by O.year_ceremony, O.category;  
  `;
  //
  // AND O.winner = 1
  if (year === -1) {
    connection.query(query_no_year, function (err, data) {
      if (err) {
        console.log(err);
        res.json({});
      } else if (data.length == 0) { // no match
        res.json([]);
      } else {
        // console.log(data);
        res.json(data);
      }
    })
  } else { // if title
    connection.query(query, function (err, data) {
      if (err) {
        console.log(err);
        res.json({});
      } else if (data.length == 0) { // no match
        res.json([]);
      } else {
        // console.log(data);
        res.json(data);
      }
    })
  }
}

// Route 17: GET /top_oscar_director
// Find the top 10 directors who have directed the most movies
// that were nominated for an Oscar, along with the number of nominations
// their movies have received, and the number of movies they directed overall
const top_oscar_director = async function (req, res) {
  var query = `
  SELECT
  p.name,
  p.imdb_name_id,
  p.photo_url,
  IFNULL(num_picture_nominations, 0) AS num_picture_nominations,
  IFNULL(num_picture_wins, 0) AS num_picture_wins,
  IFNULL(num_direction_nominations, 0) AS num_direction_nominations,
  IFNULL(num_direction_wins, 0) AS num_direction_wins,
  ROUND(IFNULL(m.avg_vote, 0), 1) AS avg_rating
FROM
  (
    SELECT
      mp.imdb_name_id,
      COUNT(DISTINCT CASE 
        WHEN o.category IN ('Outstanding Picture', 'Outstanding Production', 'Outstanding Motion Picture', 'Best Motion Picture', 'Best Picture') 
        THEN o.imdb_title_id ELSE NULL END) AS num_picture_nominations,
      COUNT(DISTINCT CASE 
        WHEN o.category IN ('Outstanding Picture', 'Outstanding Production', 'Outstanding Motion Picture', 'Best Motion Picture', 'Best Picture') AND o.winner = 1 
        THEN o.imdb_title_id ELSE NULL END) AS num_picture_wins,
      COUNT(DISTINCT CASE 
        WHEN o.category = 'DIRECTING' 
        THEN o.imdb_title_id ELSE NULL END) AS num_direction_nominations,
      COUNT(DISTINCT CASE 
        WHEN o.category = 'DIRECTING' AND o.winner = 1 
        THEN o.imdb_title_id ELSE NULL END) AS num_direction_wins
    FROM
      oscar o
      JOIN movie_people mp ON o.imdb_title_id = mp.imdb_title_id
    WHERE
      mp.category = 'director'
    GROUP BY
      mp.imdb_name_id
  ) AS oscar_data
  JOIN people p ON oscar_data.imdb_name_id = p.imdb_name_id
  LEFT JOIN (
    SELECT
      mp.imdb_name_id,
      AVG(m.avg_vote) AS avg_vote
    FROM
      movie_data m
      JOIN movie_people mp ON m.imdb_title_id = mp.imdb_title_id
    WHERE
      mp.category = 'director'
    GROUP BY
      mp.imdb_name_id
  ) AS m ON oscar_data.imdb_name_id = m.imdb_name_id
ORDER BY
  num_direction_wins DESC,
  num_direction_nominations DESC,
  num_picture_wins DESC,
  num_picture_nominations DESC,
  avg_rating DESC
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

// Route 18: 静态页面 /stats/oscar_decade
const oscar_decade = async function (req, res) {
  const page = req.query.page || 1;
  const pageSize = req.query.page_size ?? 10;
  const offset = (page - 1) * pageSize;

  var query = `
  WITH oscar_movies AS (
    SELECT DISTINCT imdb_title_id, year_ceremony
    FROM oscar
  ), 
  oscar_movies_with_rating AS (
    SELECT o.imdb_title_id, o.year_ceremony, m.avg_vote
    FROM movie_data m
    INNER JOIN oscar_movies o 
    ON o.imdb_title_id = m.imdb_title_id
  ),
  actor_nominations AS (
    SELECT mp.imdb_name_id, 
           CONCAT((om.year_ceremony DIV 10) * 10, '-', (om.year_ceremony DIV 10) * 10 + 9) AS decade, 
           COUNT(*) AS num_nominations,
           AVG(om.avg_vote) as avg_rating
    FROM movie_people mp
    INNER JOIN oscar_movies_with_rating om 
    ON mp.imdb_title_id = om.imdb_title_id
    WHERE mp.category IN ('actor','actress')
    GROUP BY mp.imdb_name_id, decade
  ),
  actor_nominations_max AS (
    SELECT MAX(num_nominations) AS max_nominations, decade
    FROM actor_nominations
    GROUP BY decade
  )
  SELECT p.name, an.max_nominations as num_nominations, an.decade, ROUND(a.avg_rating, 1) as avg_rating,a.imdb_name_id
  FROM actor_nominations_max an
  INNER JOIN actor_nominations a ON a.decade = an.decade AND a.num_nominations = an.max_nominations
  INNER JOIN people p on a.imdb_name_id = p.imdb_name_id
  WHERE an.decade <> '1920-1929'
  LIMIT ${pageSize} OFFSET ${offset}
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

// Route 19: 静态页面 /stats/oscar_actress
const oscar_actress = async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 20;
  const offset = (page - 1) * pageSize;
  var query = `
  WITH oscar_movies AS (
    SELECT DISTINCT imdb_title_id, year_ceremony
    FROM oscar
),movie_counts AS (
    SELECT imdb_name_id, COUNT(DISTINCT imdb_title_id) AS total_movies
    FROM movie_people
    WHERE category = 'actress'
    GROUP BY imdb_name_id
),movie_ages AS (
  SELECT mp.imdb_name_id,
         p.name,
         p.photo_url,
         STR_TO_DATE(p.date_of_birth, '%m/%d/%Y') AS date_of_birth,
         MAX(m.year - YEAR(STR_TO_DATE(p.date_of_birth, '%m/%d/%Y'))) AS max_age,
         ROUND(AVG(m.year - YEAR(STR_TO_DATE(p.date_of_birth, '%m/%d/%Y')))) AS average_age
  FROM movie_people mp
           JOIN movie_data m ON m.imdb_title_id = mp.imdb_title_id
           JOIN people p ON p.imdb_name_id = mp.imdb_name_id
  WHERE mp.category = 'actress'
  GROUP BY mp.imdb_name_id, p.name, p.photo_url, p.date_of_birth
)
SELECT mp.imdb_name_id, ma.name, mc.total_movies, ma.photo_url,
       COUNT(*) AS oscar_freq,
       ROUND(MAX(om.year_ceremony - YEAR(ma.date_of_birth))) AS max_oscar_age,
       ROUND(AVG(m.avg_vote),1) AS avg_rating,
       ma.max_age,
       ma.average_age
FROM movie_people mp
         JOIN oscar_movies om ON om.imdb_title_id = mp.imdb_title_id
         JOIN movie_counts mc ON mc.imdb_name_id = mp.imdb_name_id
         JOIN movie_ages ma ON ma.imdb_name_id = mp.imdb_name_id
         JOIN movie_data m ON m.imdb_title_id = mp.imdb_title_id
WHERE mp.category = 'actress'
GROUP BY mp.imdb_name_id, ma.name, ma.max_age,ma.average_age,mc.total_movies, ma.photo_url
ORDER BY AVG(om.year_ceremony - YEAR(ma.date_of_birth)) DESC
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



module.exports = {
  author,
  movie,
  movies,
  search_movies,
  person,
  people,
  search_people,
  avg_vote_person,
  related_actors,
  movie_people,
  // top10_rated_oscar_movies,
  // movie_count,
  oscarMovieRecommended,
  recentgenre,
  toplanguage,
  // search_oscar_people,
  search_oscar_filter,
  top_oscar_director,
  search_won,
  oscar_decade,
  oscar_actress,
  movie_people_acted,
}
