'use strict';
import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Wrapper from '../Wrapper';
import Body from '../../src/components/Body';

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

const props = {
  photos: [mockPhoto(1), mockPhoto(2), mockPhoto(3)],
  width: 600,
  height: 300,
  loading: false,
  toggleLike() {}
};

let WrapperComponent = Wrapper(Body, props);
let component = TestUtils.renderIntoDocument(<WrapperComponent />);
let div = TestUtils.findRenderedDOMComponentWithClass(component, 'zen-body');

let loader;
let container;
let inner;
let photos;

describe('Body Component specs', () => {
  it('Should not have a loader div', () => {
    loader = div.querySelector('.loader');
    expect(loader).to.not.exist;
  });

  it('Should have a container div', () => {
    container = div.querySelector('.container');
    expect(container).to.exist;
  });

  it(`Container width should be equal to ${props.width}px`, () => {
    expect(container.style.width).to.equal(`${props.width}px`);
  });

  it('Should have a inner div', () => {
    inner = div.querySelector('.inner');
    expect(inner).to.exist;
  });

  it(`Inner height should be equal to ${props.height}px`, () => {
    expect(inner.style.height).to.equal(`${props.height}px`);
  });

  it(`Should have ${props.photos.length} photos`, () => {
    photos = div.querySelectorAll('.photo');
    expect(photos).to.lengthOf(props.photos.length);
  });

  describe('Loading state component', () => {
    it('Should have a loader div', () => {
      props.loading = true;
      WrapperComponent = Wrapper(Body, props);
      component = TestUtils.renderIntoDocument(<WrapperComponent />);
      div = TestUtils.findRenderedDOMComponentWithClass(component, 'zen-body');

      loader = div.querySelector('.loader');
      expect(loader).to.exist;
    });
  });
});
