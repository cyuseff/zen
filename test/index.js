'use strict';
import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Dummy from '../src/components/App';

const myDiv = TestUtils.renderIntoDocument(<Dummy />);
console.log(myDiv);

describe('Empty test', () => {
  // jsdom({ skipWindowCheck: true });

  it('Empty test should run successfully', () => {
    const divText = TestUtils.findRenderedDOMComponentWithTag(myDiv, 'div');
    console.log(divText.textContent);
    console.log(myDiv.state);
    expect(divText.textContent).to.equal('Oli');
  });

  it('Fail', () => {
    expect('A').to.equal('a');
  });
});
