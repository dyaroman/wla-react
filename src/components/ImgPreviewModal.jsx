import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TOGGLE_IMG_PREVIEW_MODAL } from '../features/app/app.constants';

export function ImgPreviewModal() {
  const dispatch = useDispatch();
  const imgUrl = useSelector((state) => state['app'].imgPreviewUrl);
  const dialog = useRef(null);

  useEffect(() => {
    document.addEventListener('click', globalClickHandler);
    dialog.current?.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('click', globalClickHandler);
      dialog.current?.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  useEffect(() => {
    if (imgUrl) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [imgUrl]);

  function globalClickHandler(event) {
    if (event.target !== dialog.current) return;
    onCloseModalClick();
  }

  function keyDownHandler(event) {
    if (event.key !== 'Escape') return;
    onCloseModalClick();
  }

  function onCloseModalClick() {
    dispatch({
      type: TOGGLE_IMG_PREVIEW_MODAL,
      payload: null,
    });
  }

  if (!imgUrl) return null;

  return (
    <dialog className="img-preview-modal" ref={dialog}>
      <section className="img-preview-modal__content">
        <img src={imgUrl} alt="" className="img-preview-modal__image" />

        <button className="btn" onClick={onCloseModalClick}>
          close
        </button>
      </section>
    </dialog>
  );
}
