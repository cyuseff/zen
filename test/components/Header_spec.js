'use strict';
import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Wrapper from '../Wrapper';
import Header from '../../src/components/Header';

const props = {
  likes: 2
};

const WrapperComponent = Wrapper(Header, props);
const component = TestUtils.renderIntoDocument(<WrapperComponent />);
const div = TestUtils.findRenderedDOMComponentWithClass(component, 'zen-header');
let likes;

describe('Header Component specs', () => {
  it('Should have a like count div', () => {
    likes = div.querySelector('.like-count');
    expect(likes).to.exist;
  });

  it(`Like count text should be equal to ${props.likes}`, () => {
    expect(likes.textContent.trim()).to.equal(props.likes.toString());
  });
});
