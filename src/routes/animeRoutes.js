const express = require('express'); 
const { browseAnime,fetchSpecificAnime, getAnimeByGenre, getTopAnime, getAnimeRecommendations, getRandomAnime } = require('../controllers/animeController');

// create instance of a router
const router = express.Router(); 

router.get('/', (request,response) => {
    response.json ({
        message: "Anime routes live here!"
    });
});



// Jikan API request for random anime
router.get("/random" , getRandomAnime);

router.get("/browse", browseAnime); 

router.get("/genre", getAnimeByGenre); 

router.get("/top", getTopAnime); 

router.get ("/recommendations", getAnimeRecommendations);

module.exports = router;

