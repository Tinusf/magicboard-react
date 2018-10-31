// @flow
import { eventChannel } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';

const wsUrl = 'ws://localhost:4000';

function motionChannel() {
  return eventChannel(emitter => {
    // init the connection here
    const ws = new WebSocket(`${wsUrl}/motion`);

    ws.onopen = () => {
      ws.send('[client]: motion sensor');
    };

    ws.onmessage = (event: MessageEvent) =>
      event.data === 1
        ? emitter({ type: 'MOTION_DETECTED' })
        : emitter({ type: 'NO_MOTION_DETECTED' });

    return () => {};
  });
}

function* motionSaga(): Generator<*, *, *> {
  const channel = yield call(motionChannel);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export default [motionSaga];
