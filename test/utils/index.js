'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import Fetch from '../../src/utils/Fetch';
import {
  loadPhotos,
  handleRezise,
  getWidth,
  mapPhotos,
  getSmallestIdx,
  createColums
} from '../../src/utils';

const mockImage = (id, width, height) => ({
  id,
  width,
  height,
  name: `Photo-${id}`,
  image_url: `/fake-url-${id}`,
  times_viewed: Math.round(Math.random() * 10000),
  like: false
});

describe('Utils methods specs', () => {
  describe('createColums method', () => {
    const colums = createColums(1000, 300, 10);

    it('Should return an object', () => {
      expect(colums).to.exist;
      expect(colums).to.be.instanceof(Object);
    });

    it('Object should have a length and heights properties', () => {
      expect(colums).to.have.property('length', 3);
    });

    it('Object should have a heights and heights properties', () => {
      const {heights} = colums;
      expect(heights).to.exist;
      expect(heights).to.be.instanceof(Array);
      expect(heights).to.have.lengthOf(3);
      expect(heights).to.have.deep.property('0', 0);
      expect(heights).to.have.deep.property('1', 0);
      expect(heights).to.have.deep.property('2', 0);
    });
  });

  describe('getSmallestIdx method', () => {
    const idx = getSmallestIdx([3, 1, 2], 3);
    it('Should return a number', () => {
      expect(idx).not.to.be.NaN;
    });

    it('Should successfully found the index of the smallest value on the array', () => {
      expect(idx).to.equal(1);
    });
  });

  describe('getWidth method', () => {
    const width = getWidth(300, 10, 3);
    it('Should return a number', () => {
      expect(width).not.to.be.NaN;
    });

    it('Should successfully calculate the total width', () => {
      expect(width).to.equal(920);
    });
  });

  describe('mapPhotos method', () => {
    const array = [
      mockImage(1, 600, 200),
      mockImage(2, 600, 100),
      mockImage(3, 600, 150),
      mockImage(4, 600, 200)
    ];
    const fixedW = 300;
    const space = 10;
    const colums = createColums(1000, fixedW, space);
    const photos = mapPhotos(array, colums, fixedW, space);

    it('Should return an Array with a length of 4', () => {
      expect(photos).to.exist;
      expect(photos).to.be.instanceof(Array);
      expect(photos).to.have.lengthOf(4);
    });

    it('Photos.0', () => {
      const {left, top, resizeW, resizeH} = photos[0];
      expect(left).to.equal(0);
      expect(top).to.equal(0);
      expect(resizeW).to.equal(300);
      expect(resizeH).to.equal(100);
    });

    it('Photos.1', () => {
      const {left, top, resizeW, resizeH} = photos[1];
      expect(left).to.equal(310);
      expect(top).to.equal(0);
      expect(resizeW).to.equal(300);
      expect(resizeH).to.equal(50);
    });

    it('Photos.2', () => {
      const {left, top, resizeW, resizeH} = photos[2];
      expect(left).to.equal(620);
      expect(top).to.equal(0);
      expect(resizeW).to.equal(300);
      expect(resizeH).to.equal(75);
    });

    it('Photos.3', () => {
      const {left, top, resizeW, resizeH} = photos[3];
      expect(left).to.equal(310);
      expect(top).to.equal(60);
      expect(resizeW).to.equal(300);
      expect(resizeH).to.equal(100);
    });
  });

  describe('loadPhotos method', () => {
    const url = 'fake-url';
    const array = [
      mockImage(1, 600, 200),
      mockImage(2, 600, 100),
      mockImage(3, 600, 150),
      mockImage(4, 600, 200)
    ];
    const ids = {
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1
    };
    const fixedW = 300;
    const space = 10;
    const totalW = 1000;

    const fakeResponse = {
      current_page: 2,
      total_pages: 10,
      photos: [
        mockImage(3, 600, 200),
        mockImage(4, 600, 100),
        mockImage(5, 600, 150),
        mockImage(6, 600, 200)
      ]
    };

    let stub;
    let promise;
    before(() => {
      stub = sinon.stub(Fetch, 'get', () => Promise.resolve(fakeResponse));
    });

    after(() => stub.restore());

    it('Should return a Promise', () => {
      promise = loadPhotos(url, array, ids, totalW, fixedW, space);
      expect(promise).to.exist;
      expect(promise).to.be.instanceof(Promise);
    });

    it('Promise should resolve the new State and remove the duplicated photos', () => promise
      .then(state => {
        const {photos, ids, current_page, total_pages, width, height, loading} = state;

        expect(current_page).to.exist;
        expect(current_page).to.equal(2);

        expect(total_pages).to.exist;
        expect(total_pages).to.equal(10);

        expect(width).to.exist;
        expect(width).to.equal(920);

        expect(height).to.exist;
        expect(height).to.equal(220);

        expect(loading).to.be.false;

        expect(photos).to.have.lengthOf(6);

        expect(ids).to.exist;
        const keys = Object.keys(ids);
        expect(keys).to.have.lengthOf(6);
        expect(keys).to.include('1');
        expect(keys).to.include('2');
        expect(keys).to.include('3');
        expect(keys).to.include('4');
        expect(keys).to.include('5');
        expect(keys).to.include('6');
      }));
  });

  describe('handleRezise method', () => {
    const arr = [
      mockImage(1, 300, 200),
      mockImage(2, 300, 100),
      mockImage(3, 300, 300),
      mockImage(4, 300, 150),
      mockImage(5, 300, 200),
      mockImage(6, 300, 100)
    ];
    const fixedW = 300;
    const space = 10;
    let totalW;

    it('Should return an Object', () => {
      totalW = 1000;
      return handleRezise(arr, totalW, fixedW, space)
        .then(data => {
          expect(data).to.be.an.instanceof(Object);
        });
    });

    it('Object should have properties photo, width, height', () => {
      return handleRezise(arr, totalW, fixedW, space)
        .then(({photos, width, height}) => {
          expect(photos).to.exist;
          expect(photos).to.be.an.instanceof(Array);
          expect(width).to.equal(920);
          expect(height).to.equal(420);
        });
    });

    it('The returned grid must match [[0,4], [1,3,5], [2]]', () => {
      return handleRezise(arr, totalW, fixedW, space)
        .then(({photos}) => {
          expect(photos[0]).to.have.property('left', 0);
          expect(photos[0]).to.have.property('top', 0);

          expect(photos[1]).to.have.property('left', 310);
          expect(photos[1]).to.have.property('top', 0);

          expect(photos[2]).to.have.property('left', 620);
          expect(photos[2]).to.have.property('top', 0);

          expect(photos[3]).to.have.property('left', 310);
          expect(photos[3]).to.have.property('top', 110);

          expect(photos[4]).to.have.property('left', 0);
          expect(photos[4]).to.have.property('top', 210);

          expect(photos[5]).to.have.property('left', 310);
          expect(photos[5]).to.have.property('top', 270);
        });
    });

    it('The returned grid must match [[0,3,4], [1,2,5]]', () => {
      totalW = 700;
      return handleRezise(arr, totalW, fixedW, space)
        .then(({photos}) => {
          expect(photos[0]).to.have.property('left', 0);
          expect(photos[0]).to.have.property('top', 0);

          expect(photos[1]).to.have.property('left', 310);
          expect(photos[1]).to.have.property('top', 0);

          expect(photos[2]).to.have.property('left', 310);
          expect(photos[2]).to.have.property('top', 110);

          expect(photos[3]).to.have.property('left', 0);
          expect(photos[3]).to.have.property('top', 210);

          expect(photos[4]).to.have.property('left', 0);
          expect(photos[4]).to.have.property('top', 370);

          expect(photos[5]).to.have.property('left', 310);
          expect(photos[5]).to.have.property('top', 420);
        });
    });
  });
});
