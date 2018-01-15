//dependency
const firebase = require('firebase');
const path = require('path');
//requiring APIkey from .env file
require('dotenv').config({path: path.resolve(__dirname, '/.env')});
const apiKey = process.env.apiKey; 
const authDomain = process.env.authDomain; 
const databaseURL = process.env.databaseURL; 
const projectId = process.env.projectId; 
const storageBucket = process.env.storageBucket; 
const messagingSenderId = process.env.messagingSenderId; 

const config = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId
}
//initializing firebase database with the APIkey
firebase.initializeApp(CONFIG);

//firebase database
const database = firebase.database();

//firebase functions
const readData = (path, callback) => { //generalized read data function GET requests
  database.ref(path).once('value')
    .then(function(snapshot) {
      // console.log('this is from snapshot val', snapshot.val());
      callback(snapshot.val());
    });
};

//method for user
const createUser = (first_name, last_name, user_ID) => { //create a new user into our '/users' collection
   
  database.ref('/users/' + user_ID).update({
      first_name: first_name,
      last_name: last_name,
      full_name: `${first_name} ${last_name}`,
      user_ID: user_ID
  });
};

//methods for photos
const createPhoto = (photo_ID, photo_URL, user_ID, caption) => { //create a new photo to user reference to '/photos' collection
   // returns generated photo_ID
   console.log("createPhoto - firebase just got invoked");
   database.ref('/photos/' + photo_ID).update({
     user_ID: user_ID,
     photo_ID: photo_ID,
     photo_URL: photo_URL,
     face_ID: 'bla', //from face recog api
     faceRectangle: '', //from face recog api
     likes: 0,
     caption: caption || null,
     tag_name: null,
     time_stamp: Date.now()
   });
};

const getAllPhotos = (callback) => {
  //returns [{photoURL, caption, likes, tags, faceRectangle}]
  readData('/photos', function(allPhotos) {
    callback(allPhotos);
  })
};

const increaseLike = (photo_ID, callback) => {
  database.ref('/photos/' + photo_ID).child('likes')
  .transaction((likes) => {
    console.log("whats inside the increased like likes:", likes);
    return likes + 1;
  })
};

const decreaseLike = (photo_ID) => {
  database.ref('/photos/' + photo_ID).child('likes').transaction((likes) => {
    return (Boolean(likes)) ? likes - 1 : likes = 0;
  });
};

const getPhotoInfo = (photo_URL, callback) => { //from '/photos' collection, return 'likes' value from 'photoURL' photo.
  let path = `/photos/${photo_URL}`;

  readData(path, function(photoInfo) {
    // console.log("this is how the each photo:", photo);
    callback(photoInfo); //returns the integer
  });
};

const addPhotoTags = (photo_ID, tagName, faceRectangle) => { // combines
  //update a specific photo_URL with the tag_name
  let fullName = tagName.toLowerCase();
  let splitName = fullName.split(' ');

  let firstName = splitName[0];
  let lastName = splitName[1];

  let tag_name = 
  database.ref('/photos/' + photo_ID).child('tag_name').update({
    full_name: fullName,
    first_name: firstName,
    last_name: lastName
  });
  database.ref('/photos/' + photo_ID).update({
    faceRectangle: faceRectangle
  });
};

const getPhotoByTag = (tag_name, callback) => {
  
  let searchName = tag_name.toLowerCase();

  database.ref('/photos/').orderByChild('time_stamp').once('value').then(function(snapshot) {
    let result = {};
    snapshot.forEach(function(childSnapshot) {
      // console.log("childsnapshot.val()", childSnapshot.val());
      if (childSnapshot.val().tag_name) {
        if (childSnapshot.val().tag_name.first_name === searchName 
        ||  childSnapshot.val().tag_name.last_name === searchName
        ||  childSnapshot.val().tag_name.full_name === searchName) {
           result[childSnapshot.key] = childSnapshot.val();
        }
      }
    });
    callback(result);
  });
};

const getPhotoByUserID = (userID, callback) => {
  
  database.ref('/photos/').orderByChild('time_stamp').once('value').then(function(snapshot) {
    let result = {};
    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val().user_ID) {
        if (childSnapshot.val().user_ID === userID) {
          result[childSnapshot.key] = childSnapshot.val();
        }
      }
    });
    callback(result);
  });
}

const addCaption = (photo_ID, caption) => {
  database.ref(`/photos/${photo_ID}`).update({
    caption: caption
  });
};
// const getTagFromName = (first_name) => { //when they search for a name. type inthe name to get tag_ID so we can get all photos from that tag_ID
//   //returns tag_ID
// };

// const getAllFaceIDs = () => { //pull up all the faceIDs from all users saved in our db. just the tag.
//   //returns [face_ID] - in an array?
// };

// const getNameFromTag = (tag_ID)=> { // when displaying faceRectangle, want to display the name to prompt the user for confirmation
//   //returns full_name
// };

// const createTagOnPhoto = (full_name, user_ID) => { // will add tag reference on a photo

// };




module.exports = { createUser, createPhoto, increaseLike, decreaseLike, getPhotoInfo, getAllPhotos, addPhotoTags, getPhotoByTag, addCaption, getPhotoByUserID };
