import 'whatwg-fetch';

const createColums = (totalW, fixedW, space) => {
  const length = Math.floor((totalW + space) / (fixedW + space));
  const heights = new Array(length).fill(0);
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

const mapPhotos = (photos, colums, fixedW, space) => {
  const {heights, length} = colums;

  return photos.map((photo, idx) => {
    const {
      id,
      name,
      width,
      height,
      image_url,
      times_viewed,
      like
    } = photo;

    const i = getSmallestIdx(heights, length);
    const top = heights[i];
    const left = (fixedW + space) * i;
    const resizeH = photo.resizeH || Math.floor((height * fixedW) / width);

    heights[i] += (resizeH + space);

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
      times_viewed,
      like
    };
  });
};

const getWidth = (fixedW, space, length) => (fixedW + space) * length - space;

const loadPhotos = (url, arr, ids, totalW, fixedW, space) => {
  const colums = createColums(totalW, fixedW, space);
  let state;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.text())
      .then(text => JSON.parse(text))
      .then(({photos, current_page, total_pages}) => {
        // remove duplicated
        const filtered = photos.reduce((out, photo) => {
          if(!ids[photo.id]) {
            out.push(photo);
            ids[photo.id] = 1;
          }
          return out;
        }, []);

        // save new state info
        state = {
          ids,
          current_page,
          total_pages
        };

        return [...arr, ...filtered];
      })
      .then(array => {
        const photos = mapPhotos(array, colums, fixedW, space);
        Object.assign(state, {
          photos,
          width: getWidth(fixedW, space, colums.length),
          height: Math.max(...colums.heights),
          loading: false
        });
        resolve(state);
      })
      .catch(err => reject(err));
  });
};

const handleRezise = (arr, totalW, fixedW, space) => {
  const colums = createColums(totalW, fixedW, space);
  const photos = mapPhotos(arr, colums, fixedW, space);
  return Promise.resolve({
    photos,
    width: getWidth(fixedW, space, colums.length),
    height: Math.max(...colums.heights)
  });
};

export {loadPhotos, handleRezise};
