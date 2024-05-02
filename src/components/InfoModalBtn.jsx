import { useDispatch, useSelector } from 'react-redux';

import { useKeyPress } from '../hooks/useKeyPress';
import { triggerGtmEvent } from '../misc/functions';
import { TOGGLE_INFO_MODAL } from '../features/app/app.constants';
import { OPEN_INFO_MODAL, SHORTCUT_GTM_EVENT } from '../misc/gtm.constants';

export function InfoModalBtn() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state['app'].infoModalOpen);

  useKeyPress('shift+?', (event) => {
    if (isOpen) return;
    event.preventDefault();
    onOpenModalClick();
    triggerGtmEvent(SHORTCUT_GTM_EVENT, {
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
    <button className="btn btn--icon" onClick={onOpenModalClick}>
      <span className="icon icon--info-modal">?</span> info modal
    </button>
  );
}
