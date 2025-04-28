import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TOGGLE_IMG_PREVIEW_MODAL } from '../features/app/app.constants';

// todo: rework modal to one reusable component with createPortal to body
export function ImgPreviewModal() {
  const dispatch = useDispatch();
  const imgUrl = useSelector((state) => state['app'].imgPreviewUrl);
  const dialogRef = useRef(null);
  const cssClass = 'img-preview-modal';

  useEffect(() => {
    document.addEventListener('click', globalClickHandler);
    return () => {
      document.removeEventListener('click', globalClickHandler);
    };
  }, []);

  useEffect(() => {
    if (imgUrl) {
      dialogRef.current?.addEventListener('keydown', keyDownHandler);
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      dialogRef.current?.removeEventListener('keydown', keyDownHandler);
    }

    return () => {
      dialogRef.current?.removeEventListener('keydown', keyDownHandler);
    };
  }, [imgUrl]);

  function globalClickHandler(event) {
    if (event.target !== dialogRef.current) return;
    onCloseModalClick();
  }

  function keyDownHandler(event) {
    if (event.target.closest(`dialog.${cssClass}`) !== dialogRef.current)
      return;
    if (event.key !== 'Escape') return;
    if (!imgUrl) return;
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
    <dialog className={cssClass} ref={dialogRef}>
      <section className="img-preview-modal__content">
        <img src={imgUrl} alt="" className="img-preview-modal__image" />

        <button className="btn" onClick={onCloseModalClick}>
          close
        </button>
      </section>
    </dialog>
  );
}
