import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'; 
import fire from '../firebaseAuth';
import setUser from '../reducers/setUser';
import { changeName } from '../actions/index';
import axios from 'axios'; 
import searchByUserID from '../actions/searchByUserID';

class Authorization extends Component {
  constructor(props) {
    super(props); 
    this.changeUser = this.changeUser.bind(this)
    this.loginWithFacebook = this.loginWithFacebook.bind(this); 
    this.loginWithGoogle = this.loginWithGoogle.bind(this); 
    this.logOut = this.logOut.bind(this); 
    this.createUser = this.createUser.bind(this); 
    this.getUserUploads = this.getUserUploads.bind(this);

    fire.initFirebase(this.changeUser);
  }

  createUser() {
    if (this.props.user.name.length > 0) {
      axios.post('/instaface/users/createUser', this.props.user); 
    } 
  }

  loginWithGoogle() {
    fire.signInWithGoogle(); 
    this.createUser(); 
  }

  loginWithFacebook() {
    fire.signInWithFacebook(); 
    this.createUser(); 
  }

  logOut() {
    fire.signOut(); 
  }

  changeUser(user) {
    this.props.changeName(user); 
    this.createUser(); 
  }

  getUserUploads(e) {
    e.preventDefault();
    axios.get('/instaface/photos/getPhotoByUserID', {
      params: {
        user_ID: this.props.user.user_ID
      }
    })
      .then((response) => {
        const photosToDisplay = obj => {
          const allPhotos = [];
          
          for (let key in obj) {
            allPhotos.push(obj[key]);
          }
          
          return allPhotos;
        };

        const data = photosToDisplay(response.data);

        const sortedData = data.sort((a, b) => {
          return b.likes - a.likes;
        });

        this.props.searchByUserID(sortedData);
      })
      .catch((err) => {
        console.error('Failed to get user uploads', err);
      });
  }

  render() {
    return (
      <div className="auth">
      {this.props.user.name ?
      <div>
        <div>
          <span>Nice face, {this.props.user.name}!</span>
          <button 
            onClick={this.getUserUploads}
            className="searchByUserBtn"
          >
            Your Uploads
          </button>
          <button 
            onClick={this.logOut}
            className="logoutBtn"
          >
            Sign Out
          </button>
        </div>
      </div>
      :
      <div>
        <img 
          src="./assets/icons/google-login.png" 
          alt="google-login"
          className="loginBtn"
          onClick={this.loginWithGoogle}
        />
        <img 
          src="./assets/icons/facebook-login.png" 
          alt="facebook-login"
          className="loginBtn"
          onClick={this.loginWithFacebook}
        />
      </div>
      }
      </div>
      
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeName: changeName,
    searchByUserID: searchByUserID
  }, dispatch); 
}

export default connect(mapStateToProps, matchDispatchToProps)(Authorization);

