import { useDispatch } from 'react-redux';

import { TOGGLE_IMG_PREVIEW_MODAL } from '../features/app/app.constants';

export function ImgCell({ sources = [] }) {
  const dispatch = useDispatch();

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

  return (
    <div className="images">
      {sources.map((src) => (
        <img
          key={src}
          src={src}
          onClick={onClickPreview}
          onKeyDown={onKeypress}
          className="images__item"
          loading="lazy"
          alt=""
          tabIndex="0"
        />
      ))}
    </div>
  );
}
