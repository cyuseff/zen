import 'whatwg-fetch';

const createData = (totalW, fixedW, space) => {
  const heights = [];
  const length = Math.floor((totalW + space) / (fixedW + space));
  for(let i = 0; i < length; i++) {
    heights.push(0);
  }
  return {length, heights};
};

const getSmallestIdx = (heights, length) => {
  if(length === 1) return 0;
  let min = 0;
  for(let i = 1; i < length; i++) {
    if(heights[i] < heights[min]) min = i;
  }
  return min;
};

const mapPhotos = (photos, data, fixedW, space) => {
  const {heights, length} = data;

  return photos.map((photo, idx) => {
    const {
      id,
      name,
      width,
      height,
      image_url,
      like
    } = photo;

    const resizeH = photo.resizeH || Math.floor((height * fixedW) / width);
    const i = getSmallestIdx(heights, length);
    const left = (fixedW + space) * i;
    const top = heights[i];

    heights[i] = heights[i] + resizeH + space;

    return {
      id,
      idx,
      name,
      image_url,
      height,
      left,
      top,
      resizeH,
      resizeW: fixedW,
      like
    };
  });
};

const getWidth = (fixedW, space, length) => (fixedW + space) * length - space;

const loadPhotos = (url, arr, totalW, fixedW, space) => {
  const data = createData(totalW, fixedW, space);
  let state;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.text())
      .then(text => JSON.parse(text))
      .then(({photos, current_page, total_pages}) => {
        state = {current_page, total_pages};
        return [...arr, ...photos];
      })
      .then(array => {
        const photos = mapPhotos(array, data, fixedW, space);
        Object.assign(state, {
          photos,
          width: getWidth(fixedW, space, data.length),
          height: Math.max(...data.heights),
          loading: false
        });
        resolve(state);
      })
      .catch(err => reject(err));
  });
};

const handleRezise = (arr, totalW, fixedW, space) => {
  const data = createData(totalW, fixedW, space);
  const photos = mapPhotos(arr, data, fixedW, space);
  return Promise.resolve({
    photos,
    width: getWidth(fixedW, space, data.length),
    height: Math.max(...data.heights)
  });
};

export {loadPhotos, handleRezise};
