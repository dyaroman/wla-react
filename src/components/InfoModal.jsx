import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TOGGLE_INFO_MODAL } from '../features/app/app.constants';

export function InfoModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state['app'].infoModalOpen);
  const dialog = useRef(null);

  useEffect(() => {
    document.addEventListener('click', globalClickHandler);
    dialog.current.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('click', globalClickHandler);
      dialog.current.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  useEffect(() => {
    if (isOpen === true) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen]);

  function keyDownHandler(event) {
    if (event.key === 'Escape') {
      onCloseModalClick();
    }
  }

  function globalClickHandler(event) {
    if (event.target !== dialog.current) return;
    onCloseModalClick();
  }

  function onCloseModalClick() {
    dispatch({
      type: TOGGLE_INFO_MODAL,
      payload: false,
    });
  }

  return (
    <dialog className="info-modal" ref={dialog}>
      <section className="info-modal__content">
        <h3>Advanced search:</h3>
        <ul>
          <li>
            <code>==</code> use for exact match, ex: "Campaign Id"{' '}
            <code>==1</code> show all websites with campaign id strict equal to
            1
          </li>
          <li>
            <code>!=</code> use for strict not equal search, ex: "Campaign Id"{' '}
            <code>!=1</code> show all websites with campaign not equal 1
          </li>
        </ul>

        <h3>Shortcuts:</h3>
        <ul>
          <li>
            <code>SHIFT+?</code> to show this modal
          </li>
          <li>
            <code>CMD+SHIFT+F</code> or <code>CTRL+SHIFT+F</code> to move cursor
            to the first input field
          </li>
          <li>
            <code>CMD+SHIFT+C</code> or <code>CTRL+SHIFT+C</code> to copy value
            from "website" column in comma separated list, like:
            "website1.com,website2.com" you can use this for manual build in
            pipeline as "websites" parameter value
          </li>
        </ul>

        <h3>Convert links to env:</h3>
        <p>
          To convert links to specific env, add search parameter{' '}
          <code>convertLinksTo</code> to URL with one of two values:
        </p>
        <ul>
          <li>
            <code>dev</code> to convert links to dev env
          </li>
          <li>
            <code>prod</code> to convert links to prod env
          </li>
        </ul>

        <h3>Quick search:</h3>
        <p>
          Hold <code>OPTION</code> or <code>ALT</code> key and click on some
          table cell to insert text from cell in appropriate search field and
          move focus on it.
        </p>
      </section>

      <button className="btn" onClick={onCloseModalClick}>
        close
      </button>
    </dialog>
  );
}
