import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import initializeFeed from '../actions/initializeFeed';
import axios from 'axios';
import pathpath from 'path'; 

import Header from pathpath.resolve(__dirname, './header.jsx');
import Search from '../containers/search';
import Upload from '../containers/upload';
import Feed from '../containers/feed';
import Footer from './footer.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.refreshFeed = this.refreshFeed.bind(this);
  }

  componentDidMount() {
    this.refreshFeed();
  }

  refreshFeed() {
    axios.get('/instaface/photos/getAllPhotos')
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

        this.props.initializeFeed(sortedData);
      })
      .catch((err) => {
        console.error('Failed to get all photos', err);
      });
  }

  render() {
    return (
      <div>
        <Header refreshFeed={this.refreshFeed} />
        <Search />
        <Upload refreshFeed={this.refreshFeed}/>
        <Feed />
        <Footer />
      </div>
    )
  }
}

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    initializeFeed: initializeFeed
  }, dispatch);
};

export default connect(null, matchDispatchToProps)(App); 