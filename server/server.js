const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/movies/:movie_id', routes.movie);
app.get('/movies', routes.movies);
app.get('/author/:type', routes.author);

app.get('/search_movies', routes.search_movies);
app.get('/people/:person_id', routes.person);
app.get('/people', routes.people);
app.get('/search_people', routes.search_people);
app.get('/movie_people/:movie_id', routes.movie_people);
app.get('/related_actors/:id', routes.related_actors);
app.get('/top10_rated_oscar_movies', routes.top10_rated_oscar_movies);
app.get('/movie_count', routes.movie_count);
app.get('/avg_vote_person/:person_id', routes.avg_vote_person);
app.get('/oscar_recommend', routes.oscarMovieRecommended);
app.get('/recentgenre/:genre', routes.recentgenre);
app.get('/toplanguage/:language', routes.toplanguage);
app.get('/oscar', routes.search_oscar_people);
app.get('/search_oscar_filter', routes.search_oscar_filter);
app.get('/search_won', routes.search_won);
app.get('/top_oscar_director', routes.top_oscar_director);
app.get('/stats', routes.oscar_decade);
app.get('/oscar_actress', routes.oscar_actress);
app.get('/movie_people_acted/:person_id', routes.movie_people_acted);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
