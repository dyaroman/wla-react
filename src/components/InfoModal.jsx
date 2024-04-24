import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fromCamelCaseToWords, triggerGtmEvent } from '../misc/functions';
import { TOGGLE_INFO_MODAL } from '../features/app/app.constants';
import { CLOSE_INFO_MODAL } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';

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
    triggerGtmEvent(CLOSE_INFO_MODAL);
  }

  return (
    <dialog className="info-modal" ref={dialog}>
      <section className="info-modal__content">
        <h3>Advanced search:</h3>
        <ul>
          <li>
            <code>==</code> use for exact match, ex: "
            {fromCamelCaseToWords(COLUMNS.campaignId)}" <code>==1</code> show
            all websites with "{fromCamelCaseToWords(COLUMNS.campaignId)}"
            strict equal to 1
          </li>
          <li>
            <code>!=</code> use for strict not equal search, ex: "
            {fromCamelCaseToWords(COLUMNS.campaignId)}" <code>!=1</code> show
            all websites with "{fromCamelCaseToWords(COLUMNS.campaignId)}" not
            equal 1
          </li>
        </ul>

        <h3>Shortcuts:</h3>
        <ul>
          <li>
            <code>Shift+?</code> to show this modal
          </li>
          <li>
            <code>Cmd+Shift+F</code> or <code>Ctrl+Shift+F</code> to move cursor
            to the first input field
          </li>
          <li>
            <code>Cmd+Shift+C</code> or <code>Ctrl+Shift+C</code> to copy value
            from "{COLUMNS.website}" column in comma separated list, like:
            "website1.com,website2.com" you can use this for manual build in
            pipeline as "websites" parameter value
          </li>
          <li>
            <code>Cmd+Shift+E</code> or <code>Ctrl+Shift+E</code> to reset all
            filters and sort
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
          Hold <code>Option</code> or <code>Alt</code> key and click on some
          table cell to insert text from cell in appropriate search field and
          move focus on it.
        </p>

        <h3>Quick copy:</h3>
        <p>
          Hold <code>Cmd</code> or <code>Windows</code> key and click on some
          table cell to copy text value from it.
        </p>
      </section>

      <button className="btn" onClick={onCloseModalClick}>
        close
      </button>
    </dialog>
  );
}
