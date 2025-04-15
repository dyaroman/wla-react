import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Loader } from './Loader';
import { TOGGLE_IMG_PREVIEW_MODAL } from '../features/app/app.constants';

export function ImgCell({ sources = [] }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  function onClickPreview(event) {
    dispatch({
      type: TOGGLE_IMG_PREVIEW_MODAL,
      payload: event.target.src,
    });
  }

  function onKeypress(event) {
    if (event.code !== 'Enter' && event.code !== 'Space') return;
    event.preventDefault();
    onClickPreview(event);
  }

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="images">
      {loading && <Loader />}
      {sources.map((src) => (
        <img
          key={src}
          src={src}
          onClick={onClickPreview}
          onKeyDown={onKeypress}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          style={{ opacity: loading ? 0 : 1 }}
          className="images__item"
          loading="lazy"
          alt=""
          tabIndex="0"
        />
      ))}
    </div>
  );
}
