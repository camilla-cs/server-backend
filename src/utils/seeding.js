const { createUser } = require("./crud/UserCrud");
const { dbConnect } = require("./database");

async function seed(){

   await createUser("Camilla", "camilladp@gmail.com","adamdriver", true); 



}

dbConnect().then(() => {
    console.log("Connected to database, now seeding!"); 
    seed(); 
})

