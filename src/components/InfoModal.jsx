import { useEffect } from 'react';

import { useKeyPress } from '../hooks/useKeyPress';

export function InfoModal() {
  let dialog;

  useEffect(() => {
    dialog = document.querySelector('.info-modal');
  }, []);

  useKeyPress('shift+?', onOpenModalClick);

  function onOpenModalClick() {
    dialog.showModal();
  }

  function onCloseModalClick() {
    dialog.close();
  }

  return (
    <>
      <button className="info-modal-btn" onClick={onOpenModalClick}>
        i
      </button>
      <dialog className="info-modal">
        <section className="info-modal__content">
          <h3>Advanced search:</h3>
          <ul>
            <li>
              <code>==</code> use for exact match, ex: "Campaign Id"{' '}
              <code>==1</code> show all websites with campaign id strict equal
              to 1
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
              <code>CMD+SHIFT+F</code> or <code>CTRL+SHIFT+F</code> to move
              cursor to the first input field
            </li>
            <li>
              <code>CMD+SHIFT+C</code> or <code>CTRL+SHIFT+C</code> to copy
              value from "website" column in comma separated list, like:
              "website1.com,website2.com" you can use this for manual build in
              pipeline as "websites" parameter value
            </li>
          </ul>
        </section>

        <button className="btn" onClick={onCloseModalClick}>
          close
        </button>
      </dialog>
    </>
  );
}
