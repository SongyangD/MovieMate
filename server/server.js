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
// app.get('/song/:song_id', routes.song);
app.get('/movies/:movie_id', routes.movie);
app.get('/movies', routes.movies);
app.get('/search_movies', routes.search_movies);
app.get('/people/:person_id', routes.person);
app.get('/people', routes.people);
app.get('/search_people', routes.search_people);
app.get('/oscar_movies', routes.oscar_movies);
app.get('/search_oscar_winner', routes.search_oscar_winner);
// app.get('/album_songs/:album_id', routes.album_songs);
// app.get('/top_songs', routes.top_songs);
// app.get('/top_albums', routes.top_albums);
// app.get('/author/:type', routes.author);
// app.get('/random', routes.random);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
