import { useDispatch } from 'react-redux';

import { useKeyPress } from '../hooks/useKeyPress';
import { TOGGLE_INFO_MODAL } from '../features/app/app.constants';
import { triggerGtmEvent } from '../misc/functions';
import { OPEN_INFO_MODAL, SHORTCUT } from '../misc/gtm.constants';

export function InfoModalBtn() {
  const dispatch = useDispatch();

  useKeyPress('shift+?', (event) => {
    event.preventDefault();
    onOpenModalClick();
    triggerGtmEvent(SHORTCUT, {
      method: 'open-info-modal',
    });
  });

  function onOpenModalClick() {
    dispatch({
      type: TOGGLE_INFO_MODAL,
      payload: true,
    });
    triggerGtmEvent(OPEN_INFO_MODAL);
  }

  return (
    <button className="info-modal-btn" onClick={onOpenModalClick}>
      i
    </button>
  );
}
