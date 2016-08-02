'use strict';
import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';

import Wrapper from '../Wrapper';
import Photo from '../../src/components/Photo';

const spy = sinon.spy();
const props = {
  idx: 1,
  name: 'Test Photo',
  image_url: '/fake-url',
  left: 0,
  top: 300,
  resizeW: 300,
  resizeH: 100,
  times_viewed: 10,
  like: false,
  toggleLike: spy
};

let WrapperComponent = Wrapper(Photo, props);
let component = TestUtils.renderIntoDocument(<WrapperComponent />);
let div = TestUtils.findRenderedDOMComponentWithClass(component, 'photo');

let button;
let views;
let name;

describe('Photo Component specs', () => {
  it('Should not have "like" css class', () => {
    expect(div.className).to.not.match(/like/);
  });

  it('Should have a like button', () => {
    button = div.querySelector('.photo-like-button');
    expect(button).to.exist;
  });

  it(`When button is clicked should call the toggleLike fnc with ${props.idx} as argument`, () => {
    expect(spy.called).to.be.false;
    TestUtils.Simulate.click(button);
    expect(spy.called).to.be.true;

    const call = spy.getCall(0);
    expect(call.args[0]).to.be.equal(props.idx);
  });

  it('Should have a view count div', () => {
    views = div.querySelector('.photo-views');
    expect(views).to.exist;
  });

  it(`View count text should be equal to ${props.times_viewed}`, () => {
    expect(views.textContent.trim()).to.equal(props.times_viewed.toString());
  });

  it('Should have a name div', () => {
    name = div.querySelector('.photo-name');
    expect(name).to.exist;
  });

  it(`Name text should be equal to ${props.name}`, () => {
    expect(name.textContent.trim()).to.equal(props.name);
  });

  describe('Like state component', () => {
    it('Should have "like" css class', () => {
      props.like = true;
      WrapperComponent = Wrapper(Photo, props);
      component = TestUtils.renderIntoDocument(<WrapperComponent />);
      div = TestUtils.findRenderedDOMComponentWithClass(component, 'photo');

      expect(div.className).to.match(/like/);
    });
  });
});
