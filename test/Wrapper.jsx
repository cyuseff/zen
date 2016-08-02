import React from 'react';

// Wrapper for testing React stateless components
const Wrapper = (fn, props = {}) => React.createClass({
  render() {
    return fn(props);
  }
});

export default Wrapper;
