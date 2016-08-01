import React from 'react';
import Photo from './Photo';

const Body = ({photos, width, height, loading, toggleLike}) => {
  const render = photos.map(photo => (
    <Photo {...photo} toggleLike={toggleLike} key={photo.id} />
  ));

  let loader;
  if(loading) {
    loader = (
      <div className="loader">
        <i className="mdi mdi-refresh mdi-spin"></i> Getting the good stuff!!!
      </div>
    );
  }

  return (
    <div className="zen-body">
      <div
        className="container"
        style={{width}}
      >
        <div
          className="inner"
          style={{height}}
        >
          {render}
        </div>
      </div>
      {loader}
    </div>
  );
};

export default Body;
