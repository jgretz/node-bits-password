import {query, hashData} from './util';

const map = {
  QUERY: query,
  INSERT: hashData,
  UPDATE: hashData,
};

export default (config = {}) =>
  event => {
    const logic = map[event.action];
    if (logic) {
      return logic(config, event);
    }

    return false;
  };
