import _ from 'lodash';
import bcrypt from 'bcryptjs';
import {UPDATE, AFTER} from 'node-bits';

import findPasswordFields from './find_password_fields';

const DEFAULT_SALT_ROUNDS = 10;

const updatePasswordFields = (config, schema, data) => {
  const fields = findPasswordFields(schema);

  return _.mapValues(data, (value, key) => {
    if (!fields.includes(key)) {
      return value;
    }

    return bcrypt.hashSync(value, config.saltRounds || DEFAULT_SALT_ROUNDS);
  });
};

export const hashData = (config, args) => {
  if (args.stage === AFTER) {
    return false;
  }

  const meta = {};
  if (args.action === UPDATE) {
    meta.id = args.id;
  }

  const data = updatePasswordFields(config, args.schema, args.data);

  return {...meta, data, options: args.options};
};
