import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import {loadPhotos, handleRezise} from '../utils';

import Header from './Header';
import Body from './Body';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      ids: {},
      width: 0,
      height: 0,
      loading: true,
      current_page: 1,
      total_pages: null,
      likes: 0
    };
  }

  componentDidMount() {
    const {colWidth, space, gap} = this.props;

    // Handle Resize Events
    window.addEventListener('resize', debounce(() => {
      handleRezise(this.state.photos, (window.innerWidth - gap), colWidth, space)
        .then(state => this.setState(state))
        .catch(err => console.log(err));
    }, 100));

    // Infinity Scroll
    window.addEventListener('scroll', (e) => {
      const {photos, ids, current_page, total_pages, loading} = this.state;
      const current = e.srcElement.body.scrollTop;
      const limit = e.srcElement.body.scrollHeight - window.innerHeight;
      const url = `${this.props.url}&rpp=${this.props.rpp}&page=${current_page + 1}`;

      if(!loading && current_page < total_pages && current === limit) {
        this.setState({loading: true});
        loadPhotos(url, photos, ids, (window.innerWidth - gap), colWidth, space)
          .then(state => this.setState(state))
          .catch(err => console.log(err));
      }
    });

    // Load initial images
    const {photos, ids, current_page} = this.state;
    const url = `${this.props.url}&rpp=${this.props.rpp}&page=${current_page}`;
    loadPhotos(url, photos, ids, (window.innerWidth - gap), colWidth, space)
      .then(state => this.setState(state))
      .catch(err => console.log(err));
  }

  toggleLike(idx) {
    const photos = this.state.photos;
    const photo = photos[idx];
    const like = !photo.like;
    let likes = this.state.likes;

    if(like) {
      likes++;
    } else {
      likes--;
    }

    photos.splice(idx, 1, Object.assign({}, photo, {like}));
    this.setState({photos, likes});
  }

  render() {
    const {photos, width, height, loading, likes} = this.state;
    return (
      <div className={`zen-app ${this.props.animate ? 'animate' : ''}`}>
        <Header likes={likes} />
        <Body
          photos={photos}
          width={width}
          height={height}
          loading={loading}
          toggleLike={(idx) => this.toggleLike(idx)}
        />
      </div>
    );
  }
}

App.defaultProps = {
  animate: false,
  colWidth: 236,
  space: 12,
  gap: 20,
  rpp: 30,
  url: 'https://api.500px.com/v1/photos?feature=popular&image_size=31&consumer_key=wYcRITj1GoHZnC0mgXe0K66IL7n3aMQkxyTa5s9M'
};

export default App;
