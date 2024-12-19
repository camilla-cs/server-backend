const {User} = require("../../models/UserModel");

async function createUser(username, email,password, isAdmin) {
    let result = await User.create({
        username: username,
        email: email,
        password:password,
        isAdmin: isAdmin
    }); 

    return result; 

}


module.exports = {
    createUser
}