const express = require('express'); 
const { browseAnime, getAnimeGenres, getTopAnime, getAnimeRecommendations } = require('../controllers/animeController');

// create instance of a router
const router = express.Router(); 

router.get('/', (request,response) => {
    response.json ({
        message: "Anime routes live here!"
    });
});



// Jikan API request for random anime
router.get("/random" , async (request, response) => {
    let animeData = {};

    let randomNumber = Math.floor(Math.random() * 1025) + 1; 
    let responseData = await fetch ("https://api.jikan.moe/v4/anime/" + randomNumber);
    animeData = await responseData.json(); 


    response.json({
        result:animeData
    })

}); 

router.get("/browse/", browseAnime); 

router.get("/genres", getAnimeGenres); 

router.get("/top", getTopAnime); 

router.get ("/recommendations", getAnimeRecommendations);

module.exports = router;

