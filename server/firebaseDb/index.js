//dependency
const firebase = require('firebase');
const path = require('path');
//requiring APIkey from .env file
require('dotenv').config({path: path.resolve(__dirname, '/.env')});
const CONFIG = require('../../api.js')


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

const createUser = (username, first_name, last_name, user_ID) => { //create a new user into our '/users' collection
  //I: from CLIENT username, first_name, last_name, user_ID
  
  database.ref('/users/' + user_ID).update({
      username: username,
      first_name: first_name,
      last_name: last_name,
      full_name: `${first_name} ${last_name}`,
      user_ID: user_ID
  });
};

const createPhoto = (photo_URL, user_ID, caption) => { //create a new photo to user reference to '/photos' collection
   // returns generated photo_ID
   console.log("createPhoto - firebase just got invoked");
   database.ref('/photos/' + photo_URL).update({
     user_ID: user_ID,
     face_ID: 'bla', //from face recog api
     faceRectangle: '', //from face recog api
     likes: 0,
     caption: caption || null,
     tag_name: null,
   });
};

const getAllPhotos = (callback) => {
  //returns [{photoURL, caption, likes, tags, faceRectangle}]
  readData('/photos', function(allPhotos) {
    callback(allPhotos);
  })
};

const increaseLike = (photo_URL) => {
  database.ref('/photos/' + photo_URL).child('likes').transaction((likes) => {
    console.log("whats inside the increased like", likes);
    return likes++;
  });
};

const decreaseLike = (photo_URL) => {
  database.ref('/photos/' + photo_URL).child('likes').transaction((likes) => {
    return (Boolean(likes)) ? likes-- : likes = 0;
  });
};

const getPhotoInfo = (photo_URL, callback) => { //from '/photos' collection, return 'likes' value from 'photoURL' photo.
  let path = `/photos/${photo_URL}`;

  readData(path, function(photoInfo) {
    // console.log("this is how the each photo:", photo);
    callback(photoInfo); //returns the integer
  });
};

// const getTagFromName = (first_name) => { //when they search for a name. type inthe name to get tag_ID so we can get all photos from that tag_ID
//   //returns tag_ID
// };

const addPhotoTags = (photo_URL, tag_name) => { // combines
  //update a specific photo_URL with the tag_name
  database.ref('/photos/' + photo_URL).child('tag_name').transaction((tag) => {
    return tag_name;
  });
};

// const getAllFaceIDs = () => { //pull up all the faceIDs from all users saved in our db. just the tag.
//   //returns [face_ID] - in an array?
// };

// const getNameFromTag = (tag_ID)=> { // when displaying faceRectangle, want to display the name to prompt the user for confirmation
//   //returns full_name
// };

// const createTagOnPhoto = (full_name, user_ID) => { // will add tag reference on a photo

// };




module.exports = { createUser, createPhoto, increaseLike, decreaseLike, getPhotoInfo, getAllPhotos, addPhotoTags };
