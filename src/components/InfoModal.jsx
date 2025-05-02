import { useDispatch, useSelector } from 'react-redux';

import { Modal } from './Modal';
import { fromCamelCaseToWords } from '../misc/functions';
import { COLUMNS } from '../misc/columns.constants';
import { TOGGLE_INFO_MODAL_OPENED } from '../features/app/app.constants';

export function InfoModal() {
  const dispatch = useDispatch();
  const infoModalOpened = useSelector((state) => state['app'].infoModalOpened);

  function onClose() {
    dispatch({
      type: TOGGLE_INFO_MODAL_OPENED,
      payload: false,
    });
  }

  return (
    <Modal isOpen={infoModalOpened} onClose={onClose} title="Info modal">
      <h3>Shortcuts:</h3>
      <ul>
        <li>
          <code>Cmd+/</code> or <code>Ctrl+/</code> to toggle sidebar
        </li>
        <li>
          <code>Shift+?</code> to show this modal
        </li>
        <li>
          <code>Cmd+Shift+F</code> or <code>Ctrl+Shift+F</code> to move cursor
          to the first filter
        </li>
        <li>
          <code>Shift+Alt+C</code> to copy websites urls
        </li>
        <li>
          <code>Cmd+Shift+C</code> or <code>Ctrl+Shift+C</code> to copy value
          from "{COLUMNS.website}" column as comma separated list, like:
          "website1.com,website2.com" you can use this for manual build in
          pipeline as "websites" parameter value
        </li>
        <li>
          <code>Cmd+Shift+E</code> or <code>Ctrl+Shift+E</code> to reset all
          filters and sort
        </li>
      </ul>

      <h3>Advanced search:</h3>
      <ul>
        <li>
          <code>==</code> use for exact match, ex: "
          {fromCamelCaseToWords(COLUMNS.pages)}" <code>==sc</code> show all
          websites that has "sc" page, without semi match like "credit-
          <b>sc</b>ore"
        </li>
        <li>
          <code>!=</code> use for strict not equal search, ex: "
          {fromCamelCaseToWords(COLUMNS.pages)}" <code>!=sc</code> show all
          websites that hasn't "sc" page
        </li>
      </ul>

      <h3>Quick search:</h3>
      <p>
        Hold <code>Option</code> or <code>Alt</code> key and click on some table
        cell to insert text from cell in appropriate search filter and move
        focus on it.
      </p>

      <h3>Quick copy:</h3>
      <p>
        Hold <code>Cmd</code> or <code>Windows</code> key and click on some
        table cell to copy text value from it.
      </p>

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

      <h3>Tips:</h3>
      <ul>
        <li>Click on logo to scroll table to the top.</li>
      </ul>
    </Modal>
  );
}
