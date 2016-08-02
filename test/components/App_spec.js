'use strict';

import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';

import App from '../../src/components/App';

const mockPhoto = (id) => ({
  id,
  idx: id,
  name: 'Test Photo 2',
  image_url: '/fake-url',
  left: 0,
  top: 300,
  resizeW: 300,
  resizeH: 100,
  times_viewed: 10,
  like: false
});

const props = {};

let stub;
let component;
let div;

let header;
let body;

describe('Body Component specs', () => {
  before((done) => {
    component = TestUtils.renderIntoDocument(<App {...props} />);
    stub = sinon.stub(component, 'componentDidMount');
    div = TestUtils.findRenderedDOMComponentWithClass(component, 'zen-app');

    component.setState({
      photos: [mockPhoto(1), mockPhoto(2), mockPhoto(3)]
    })

    setTimeout(() => done(), 500);
  });

  after(() => {
    component.componentDidMount.restore();
  });

  it('Should have a Header', () => {
    header = div.querySelector('.zen-header');
    expect(header).to.exist;
  });

  it('Should have a Body', () => {
    body = div.querySelector('.zen-body');
    expect(body).to.exist;
  });

  it('"toggleLike" method should toggle like prop of a photo and likes count', (done) => {
    const spy = sinon.spy(component, 'toggleLike');
    const idx = 1;
    let photo;
    let likes;

    photo = component.state.photos[idx];
    expect(photo).to.have.property('like', false);

    likes = component.state.likes;
    expect(likes).to.equal(0);

    component.toggleLike(idx);

    photo = component.state.photos[idx];
    expect(photo).to.have.property('like', true);

    likes = component.state.likes;
    expect(likes).to.equal(1);

    component.toggleLike(idx);

    photo = component.state.photos[idx];
    expect(photo).to.have.property('like', false);

    likes = component.state.likes;
    expect(likes).to.equal(0);
    done();
  });
});
