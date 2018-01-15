import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import searchTag from '../actions/searchTag';
import axios from 'axios';
import Likes from './likes';

class FeedEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false
    };

    this.hoverHandler = this.hoverHandler.bind(this);
    this.hoverOutHandler = this.hoverOutHandler.bind(this);
    this.tagClickHandler = this.tagClickHandler.bind(this);
  }

  hoverHandler() {
    this.setState({
      hovered: true
    });
  }

  hoverOutHandler() {
    this.setState({
      hovered: false
    });
  }

  tagClickHandler(e) {
    e.preventDefault();
    axios.get('/instaface/photos/getPhotoByTag', {
      params: {
        tag_name: this.props.photo.tag_name.full_name
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

        this.props.searchTag(sortedData);
      })
      .catch((err) => {
        console.error('Failed to search by tag', err);
      });
  }

  render() {
    return (
      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 photoWrapper">
        <img 
          src={this.props.photo.photo_URL} 
          alt={this.props.photo.caption}
          className="photoEntry feedContainer"
          onMouseEnter={this.hoverHandler}
          onMouseLeave={this.hoverOutHandler}
        />

        {
          !this.state.hovered ? null :
          !this.props.photo.faceRectangle ? null :
          <div>
            <div 
              className="faceRectangle"
              onMouseEnter={this.hoverHandler}
              style={{
                top: this.props.photo.faceRectangle.topLeftY + 'px',
                left: this.props.photo.faceRectangle.topLeftX + 'px',
                width: this.props.photo.faceRectangle.width + 'px',
                height: this.props.photo.faceRectangle.height + 'px'
              }}
            >
            </div>
            {
              !this.props.photo.tag_name ? null :
              <div 
                className="centeredTagName"
                onMouseEnter={this.hoverHandler}
                onClick={this.tagClickHandler}
                style={{
                  top: (this.props.photo.faceRectangle.topLeftY + this.props.photo.faceRectangle.height) + 'px',
                  left: (this.props.photo.faceRectangle.topLeftX + (this.props.photo.faceRectangle.width / 4)) + 'px'
                }}
              >
                {this.props.photo.tag_name.full_name}
              </div>
            }
          </div>
        }

        <span>{this.props.photo.caption}</span>
        <Likes 
          id={this.props.photo.photo_ID}
          count={this.props.photo.likes} 
        />
      </div>
    );
  }
}

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    searchTag: searchTag
  }, dispatch);
}

export default connect(null, matchDispatchToProps)(FeedEntry);