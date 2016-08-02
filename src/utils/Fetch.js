import 'isomorphic-fetch';

const Fetch = {
  get(url) {
    console.log(url);
    return fetch(url)
      .then(res => res.text())
      .then(text => JSON.parse(text));
  }
};

export default Fetch;
