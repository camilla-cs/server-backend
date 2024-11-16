const {app} = require('./server.js'); 

const PORT = process.env.PORT ?? 8080; 

app.listen(PORT,async () => {

  

    console.log(`Server is listening on port ${PORT}`);
});