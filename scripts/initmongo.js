// initmongo.js

//To execute:
//$mongo projectdb scripts/initmongo.js
//Above command to be executed from the directory where initmongo.js is present

//Perform a cleanup of existing data. 
db.dropDatabase()

// Create a collection for User Service (USV)
db.createCollection("users")
// Optionally, you can define indexes or validations for the "users" collection here

// Insert a sample user with an "id" field
db.users.insert({
  email: "default_user@gmail.com",
  password: "password",
  ownedFiles: [],
  accessedFiles: []
})

// Create a collection for Question Service (QSV)
db.createCollection("files")
// Optionally, you can define indexes or validations for the "questions" collection here

// Insert a sample question with an "id" field
