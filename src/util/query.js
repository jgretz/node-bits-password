import _ from 'lodash';
import { BEFORE } from 'node-bits';

import findPasswordFields from './find_password_fields';

const excludePasswordFromResults = (args) => {
  const passwordFields = findPasswordFields(args.schema);

  return args.result.map((item) => _.omit(item, passwordFields));
};

export const query = (config, args) => {
  if (config.includePasswordInQuery === undefined || config.includePasswordInQuery) {
    return false;
  }

  if (args.stage === BEFORE || !_.isArray(args.result)) {
    return false;
  }

  return {
    result: excludePasswordFromResults(args)
  };
};
