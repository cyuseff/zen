import React from 'react';

const Photo = (props) => {
  const {idx, name, image_url, left, top, resizeW, resizeH, like, toggleLike} = props;
  const divStyle = {
    left,
    top,
    width: resizeW,
    height: resizeH,
    backgroundImage: `url('${image_url}')`
  };

  return (
    <div className={`photo ${like ? 'like' : ''}`} style={divStyle}>
      <span className="photo-like-button" onClick={() => toggleLike(idx)}>
        <i className="mdi mdi-heart"></i>
      </span>
      <div className="photo-name">
        {name}
      </div>
    </div>
  );
};

export default Photo;
