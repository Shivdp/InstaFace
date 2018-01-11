import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'; 
import fire from '../firebaseAuth';
import setUser from '../reducers/setUser'
  
  class Authorization extends Component {

    constructor(props) {
     super(props); 
     fire.initFirebase(()=>{});
     //fire.signOut(); 
   }
 
    render() {
      return (
        <div className="auth">
         <button>Sign In With Google</button>
         <button>Sign In With Facebook</button>
        </div>
      );
    }
  }
  
 
 const matchStateToProps = (state) => {
   return {
     activeUser: activeUser
   }
 }
 
 const matchDispatchToProps = (dispatch) => {
   return bindActionCreators({
     setUser: setUser
   }, dispatch); 
 }
 
 export default connect(matchDispatchToProps)(Authorization);