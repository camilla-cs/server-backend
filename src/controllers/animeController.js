const browseAnime = async ( request, response) => {
    const {title, type, episodes, rating, score, rank, synopsis, year,studios, genres, themes } = request.query; 


    try {
        // query parameters for Jikan API
        const params = new URLSearchParams(); 
        if (title) params.appen("title", title); 
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
        const response = await fetch(apiUrl); 

        //chech if response is ok
        if (!response.ok) {
            throw new Error (`Failed to fetch anime.`); 
        }

        // parse the response as Json 
        const animeData = await response.json(); 

        //return anime data to the client 
        response.json(animeData); 


    } catch (error) {
        console.error ("Error fetching anime: ", error.message); 
        response.status(500).json({message:error.message}); 
    }
    
}; 

module.exports = {
    browseAnime
}