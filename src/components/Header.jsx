import React from 'react';

const Header = ({likes}) => {
  return (
    <div className="zen-header">
      <span className="like-count">
        <i className="mdi mdi-heart"></i> {likes}
      </span>
      <h1>Masonry Demo</h1>
    </div>
  );
};

export default Header;
