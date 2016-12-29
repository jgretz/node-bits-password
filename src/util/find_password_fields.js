import _ from 'lodash';
import { PASSWORD } from 'node-bits';

export default (schema) => {
  const keys = _.keys(schema);
  return _.filter(keys, (key) => {
    const field = schema[key];
    return field.type && field.type === PASSWORD;
  });
};
