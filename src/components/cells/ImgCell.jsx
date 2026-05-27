import { useEffect, useState } from 'react';

import { Loader } from '../Loader';
import { Modal } from '../Modal';

export function ImgCell({ sources = [] }) {
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState(null);

  function onClickPreview(event) {
    setPreviewLoading(true);
    setPreviewSource(event.target.src);
  }

  function onModalClose() {
    setPreviewLoading(false);
    setPreviewSource(null);
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
    <>
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

      <Modal
        isOpen={!!previewSource}
        onClose={onModalClose}
        title={previewSource}
      >
        <div className="images">
          {previewLoading && <Loader />}
          <img
            src={previewSource}
            alt=""
            onLoad={() => setPreviewLoading(false)}
            onError={() => setPreviewLoading(false)}
            style={{ opacity: previewLoading ? 0 : 1 }}
            className={previewLoading ? 'images__item' : ''}
          />
        </div>
      </Modal>
    </>
  );
}
