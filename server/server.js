const fs = require('fs');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser'); // for parsing application / json
const { ApolloServer, UserInputError } = require('apollo-server-express');
// const { GraphQLScalarType } = require('graphql');
// const { Kind } = require('graphql/language');
const { MongoClient, ObjectId } = require('mongodb');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const senderEmail = 'huhaolei0629@gmail.com';
const senderPW = 'frwxrwmzhlebsejq';
const SECRET = "it5007_course_project_team_16";

/******************************************* 
Sending Email CODE
********************************************/
// Function to send out an email for user signing-up and file sharing notification

let emailContent = new Map();
emailContent.set('user_signup', {subject: 'User Verification', text: 'click http://localhost:5173/login to verify your sign-up to the Decentralized File Storage & Sharing System.'});
emailContent.set('file_sharing', {subject: 'Receive a new shared file', text: 'You have been shared with a new file. Use this link http://localhost:5173/dashboard to access it on the Decentralized File Storage & Sharing System.'});
emailContent.set('file_removed', {subject: 'Remove a shared file', text: 'The file has been successfully removed. log in http://localhost:5173/dashboard to check on the Decentralized File Storage & Sharing System.'});
async function sendEmail(receiver, content) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: senderPW
    }
  });
  if (!emailContent.has(content)) {
    console.log('no such email content:', content);
    return;
  }

  var content = emailContent.get(content);
  var subject = content.subject; 
  var text = content.text;
  var mailOptions = {
    from: senderEmail,
    to: receiver,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

/******************************************* 
DATABASE CONNECTION CODE
********************************************/
//Note that the below variable is a global variable 
//that is initialized in the connectToDb function and used elsewhere.
let db;

//Function to connect to the database
async function connectToDb() {
    const url = 'mongodb://localhost/projectdb';
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
  }

/******************************************* 
GraphQL CODE
********************************************/  

const resolvers = {
  Query: {
    getUser: getUserResolver,
    getFiles: getFilesResolver,
    getSharedFiles: getSharedFilesResolver, 
  },
  Mutation: {
    addUser: addUserResolver,
    addFile: addFileResolver,
    deleteFile: deleteFileResolver,
    updateFile: updateFileResolver,
    updateSharedEmails: updateSharedEmailsResolver,
  },
};

async function getUserResolver(_, { email })
{
  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      throw new Error(`User with email ${email} does not exist`);
    }
    return user;
  } catch (error) {
    throw new Error(`Error retrieving user: ${error.message}`);
  }
};

async function getFilesResolver(_, { ids })
{
  try {
    ids = ids.map(id => ObjectId(id));
    const files = await db.collection('files').find({ _id: { $in: ids } }).toArray();
    return files;
  } catch (error) {
    throw new Error(`Error retrieving owned files: ${error.message}`);
  }
};

async function getSharedFilesResolver(_, { ids })
{
  try {
    ids = ids.map(id => ObjectId(id));
    const files = await db.collection('files').find({ _id: { $in: ids } }).toArray();
    return files;
  } catch (error) {
    throw new Error(`Error retrieving shared files: ${error.message}`);
  }
}

async function addUserResolver(_, { email, password })
{
  try {
    const user = await db.collection('users').findOne({ email });
    if (user) {
      throw new Error(`This email already exists`);
    }

    let accessedFiles = []
    const files = await db.collection('files').find().toArray();
    for (const file of files) {
      if (email in file.sharedEmails) {
        accessedFiles.push(file._id)
      }
    }

    const newUser = {
      email: email,
      password: password,
      ownedFiles: [],
      accessedFiles: accessedFiles
    };

    const addUserResult = await db.collection('users').insertOne(newUser);
    const insertedUser = addUserResult.ops[0];
    console.log('Inserted user: ', insertedUser);

    return insertedUser;
  } catch (error) {
    throw new Error(`Error inserting user: ${error.message}`);
  }
};

async function addFileResolver(_, { fileHash, fileName, fileSize, ownerEmail })
{
  try {
    const file = await db.collection('files').findOne({ fileHash });
    if (file) {
      throw new Error(`This file already exists`);
    }

    const uploadedTime = new Date().toLocaleString();
    const newFile = {
      fileHash,
      fileName,
      fileSize,
      ownerEmail,
      uploadedTime,
      sharedEmails: [],
    };

    const addFileResult = await db.collection('files').insertOne(newFile);
    const insertedFile = addFileResult.ops[0];
    console.log('Inserted file: ', insertedFile);

    const updateUserResult = await db.collection('users').updateOne(
      { email: ownerEmail },
      { $push: { ownedFiles: insertedFile._id }} );

    if (updateUserResult.nModified === 0) {
      throw new Error('Database failed to update user.');
    }

    const updatedUser = await db.collection('users').findOne({ email: ownerEmail });
    console.log('Updated user: ', updatedUser);

    return updatedUser;
  } catch (error) {
    throw new Error(`Error inserting file: ${error.message}`);
  }
};

async function deleteFileResolver(_, { id })
{
  try {
    const file = await db.collection('files').findOne({ _id: ObjectId(id) });
    if (!file) {
      throw new Error(`This file does not exist`);
    }

    const user = await db.collection('users').findOne({ email: file.ownerEmail });
    const filteredFiles = user.ownedFiles.filter(fileId => fileId.toString() !== id);
    await db.collection('users').updateOne(
      { email: file.ownerEmail },
      { $set: { ownedFiles: filteredFiles } }
    );

    for (const email of file.sharedEmails) {
      const user = await db.collection('users').findOne({ email });
      if (user) {
        const filteredFiles = user.accessedFiles.filter(fileId => fileId.toString() !== id);
        await db.collection('users').updateOne(
          { email },
          { $set: { accessedFiles: filteredFiles } }
        );
      }
    }

    await db.collection('files').findOneAndDelete({ _id: ObjectId(id) });

    const updatedUser = db.collection('users').findOne({ email: file.ownerEmail });
    
    return updatedUser;
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

async function updateFileResolver(_, { id, fileHash, fileName, fileSize })
{
  try {
    const result = await db.collection('files').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {fileHash, fileName, fileSize} },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      throw new Error(`This file does not exist anymore`);
    }
    return result.value;
  } catch (error) {
    throw new Error(`Error updating file: ${error.message}`);
  }
};

async function updateSharedEmailsResolver(_, { id, emails })
{
  try {
    for (const email of emails) {
      const user = db.collection('users').findOne({ email });
      if (user) {
        await db.collection('users').updateMany(
          { email },
          { $push: { accessedFiles: ObjectId(id) } }
        );
      }
    }

    const result = await db.collection('files').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {sharedEmails: emails} },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      throw new Error(`This file does not exist anymore`);
    }
    return result.value;
  } catch (error) {
    throw new Error(`Error updating file: ${error.message}`);
  }
}

const app = express();
const port = 3001;

//Attaching a Static web server.
app.use(express.static('public')); 
// for parsing application/json
app.use(bodyParser.json()); 

app.use(cors());

// router for sending email when signing up or sharing a file
app.post('/api/send_email', async (req, res) => {
  const { email, content } = req.body;
  console.log('req:', req.body);
  try {
    // send confirmation email
    await sendEmail(email, content);
    res.status(200).json({ success: true, message: 'Email sent successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// router for login in with jwt
app.post('/api/login', async (req, res) => {
  const { email, password} = req.body;
  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({success: false, message: 'User not found'});
    }

    if (user.password != password) {
      return res.status(401).json({success: false, message: 'email or password is wrong'});
      
    }
    // generate jwt
    const token = jwt.sign({ email: user.email }, SECRET, {expiresIn: '1h'});
    console.log('token:', token);
    res.json({success: true, token});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// middleware for jwt authentication
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) return res.status(401).json({ success: false, message: 'Missing Authorization Header' }); // No token obtained
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Token Verification Failed' });
    req.email = user.email; // add user info to request, here is email
    next();
  });
}

// this is an example to check whether server can get user email from the token
// when the client calls this api, the request header needs to add 'Authorization'
// 'Authorization': `token`
app.get('/api/token_example', authenticateToken, (req, res) => {
  const userEmail = req.email;
  console.log('get user email from token:', userEmail);
  res.json({success: true, user_email: userEmail});
});

//Creating and attaching a GraphQL API server.
async function startServer() {
  const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
      console.log(error);
      return error;
    }
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}
startServer();

//Starting the server that runs forever.
  (async function () {
    try {
      await connectToDb();
      app.listen(port, function () {
        console.log(`App started on port ${port}`);
      });
    } catch (err) {
      console.log('ERROR:', err);
    }
  })();