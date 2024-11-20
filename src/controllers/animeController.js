// browse anime
const browseAnime = async ( request, response) => {
    const {title, type, episodes, rating, score, rank, synopsis, year,studios, genres, themes } = request.query; 


    try {
        // query parameters for Jikan API
        const params = new URLSearchParams(); 
        if (title) params.append("title", title); 
        if (type) params.append("type", type); 
        if (episodes) params.append ("episodes", episodes); 
        if (rating) params.append ("rating", rating); 
        if (score) params.append("score",score); 
        if (rank) params.append("rank", rank); 
        if (synopsis) params.append("synopsis", synopsis); 
        if (year) params.append("year", year); 
        if (studios) params.append("studios", studios); 
        if (genres) params.append("genres", genres); 
        if (themes) params.append("themes", themes); 
        

        // fetch data from Jikan API 
        const apiUrl = `https://api.jikan.moe/v4/anime?${params.toString()}`; 
        console.log("API URL: ", apiUrl); 
        const apiResponse = await fetch(apiUrl); 

        //chech if response is ok
        if (!apiResponse.ok) {
            throw new Error (`Failed to fetch anime.`); 
        }

        // parse the response as Json 
        const animeData = await apiResponse.json(); 

        //return anime data to the client 
        response.json(animeData); 


    } catch (error) {
        console.error ("Error fetching anime: ", error.message); 
        response.status(500).json({message:error.message}); 
    }
    
}; 

// Fetch genres, themes 
const getAnimeGenres = async (request, response) => {
    // accept filter parameter
    const {filter} = request.query; 

    try {
        // API URL      // base URL                         // ternary operator. 
                                                            // checks if the filter variable exists and is truthy. if it exist it append the filter to the url otherwise appends nothing "". 
        const apiUrl = `https://api.jikan.moe/v4/genres/anime${filter ? `?filter=${filter}` : ""}`; 
        console.log("API URL: ", apiUrl); 

        //fetch data from jikan api 
        const apiResponse = await fetch(apiUrl); 

        // check if response is ok 
        if (!apiResponse.ok) {
            throw new Error("Failed to fetch anime genres."); 

        }

        // parse json response
        const genreData = await apiResponse.json(); 

        // return genre data
        response.json(genreData); 
    } catch (error) {
        console.error("Error fetching anime genres: ", error.message); 
        response.status(500).json({message: error.message}); 
    }
}; 

// Get top anime
const getTopAnime = async (request , response) => {
    const {type, filter, rating, sfw, page, limit} = request.query; 

    try {

        // query parameters
        const params = new URLSearchParams();
        if (type) params.append("type", type); 
        if (filter) params.append("filter", filter); 
        if (rating) params.append("rating", rating); 
        if (sfw) params.append("sfw", sfw); 
        if (page) params.append("page", page); 
        if (limit) params.append("limit", limit); 
        
        // api url 
        const apiUrl= `https://api.jikan.moe/v4/top/anime?${params.toString()}`; 
        console.log ("API URL: ", apiUrl); 

        const apiResponse = await fetch(apiUrl); 

        //check response
        if (!apiResponse.ok) {
            throw new Error ("Failed to fetch top anime");

        }

        // parse json response
        const topAnimeData = await apiResponse.json(); 

        // return data
        response.json(topAnimeData); 

    } catch (error) {
        console.error("Error in fetchin top anime"); 
        response.status(500).json({message:error.message}); 
    }
   

};

// get anime recommendations based on title 
const getAnimeRecommendations = async (request, response) => {
    // get title from query params
    const {title} = request.query; 

    try {
        if(!title) {
            return response.status(400).json({message:"Title is required to fetch recommendations. "}); 
        }

        // search anime title to get mal_id 
        const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}`; 
        const searchResponse = await fetch (searchUrl); 

        if (!searchResponse.ok) {
            throw new Error ("Failed to fetch anime details."); 

        }

        const searchData = await searchResponse.json(); 

        if (!searchData.data || searchData.data.length === 0) {
            return response.status(404).json({message: "Anime not found."}); 

        }

        // get mal_id
        const mal_id = searchData.data[0].mal_id; 

        // get recommendations based on mal_id
        const recommendationsUrl = `https://api.jikan.moe/v4/anime/${mal_id}/recommendations`;
        const recommendationsResponse = await fetch (recommendationsUrl); 

        if (!recommendationsResponse.ok) {
            throw new Error ("Failed to fetch anime recommendations."); 
        }

        const recommendationsData = await recommendationsResponse.json(); 

        // return recommendations to the user
        response.json (recommendationsData); 

    } catch (error) {
        console.error("Error fetching anime recommendations: ", error.message); 
        response.status(500).json({message: error.message}); 
    }
}; 

module.exports = {
    browseAnime,
    getAnimeGenres,
    getTopAnime,
    getAnimeRecommendations,
}