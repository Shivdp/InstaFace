import React, { Component } from 'react';
import Likes from './likes';

class FeedEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false
    };

    this.hoverHandler = this.hoverHandler.bind(this);
    this.hoverOutHandler = this.hoverOutHandler.bind(this);
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
          !this.props.photo.tag_name ? null :
          <div 
            className="centeredTagName"
            onMouseEnter={this.hoverHandler}
          >
            {this.props.photo.tag_name.full_name}
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

export default FeedEntry;