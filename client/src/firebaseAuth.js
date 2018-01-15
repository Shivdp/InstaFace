let firebase = require('firebase'); 

const config = require('../../api');

// const apiKey = process.env.apiKey; 
// const authDomain = process.env.authDomain; 
// const databaseURL = process.env.databaseURL; 
// const projectId = process.env.projectId; 
// const storageBucket = process.env.storageBucket; 
// const messagingSenderId = process.env.messagingSenderId; 

// const config = {
//   apiKey: apiKey,
//   authDomain: authDomain,
//   databaseURL: databaseURL,
//   projectId: projectId,
//   storageBucket: storageBucket,
//   messagingSenderId: messagingSenderId
// }


let auth; 
let changeUser; 

let fire = {
  initFirebase : (callback) => {
    //initialize firebase with a callback that is triggered on any event change
    changeUser = callback; 
    firebase.initializeApp(config);
    auth = firebase.auth(); 
    auth.onAuthStateChanged(fire.onAuthStateChanged.bind(this));
  },

  signInWithGoogle : () => {
    // Sign in Firebase using popup auth and Google as the identity provider.
    let provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  },

  signInWithFacebook : () => {
    // Sign in Firebase using popup auth and Facebook as the identity provider.
    let provider = new firebase.auth.FacebookAuthProvider(); 
    auth.signInWithPopup(provider); 
  },
  
  signOut : () => {
    // Sign out of Firebase.
    auth.signOut();
  },

  onAuthStateChanged : function(user) {
    //triggers on any state change
    let result; 
    if (user) {
      result = {name: user.displayName, email: user.email, user_ID: user.uid}
    } else {
      result = {name: '', email: '', user_ID: ''}
    }
    changeUser(result); 
  }
}


module.exports = fire; 