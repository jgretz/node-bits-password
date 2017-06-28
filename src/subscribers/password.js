import _ from 'lodash';
import {
  BEFORE, AFTER, PASSWORD,
  GET, POST, PUT,
} from 'node-bits';
import autobind from 'class-autobind';
import bcrypt from 'bcryptjs';

const PASSWORD_MASK = '******';
const DEFAULT_SALT_ROUNDS = 10;

export default class PasswordSubscriber {
  // hooks
  constructor(config) {
    autobind(this);

    this.config = config;
    this.map = {
      [GET]: this.get,
      [POST]: this.post,
      [PUT]: this.put,
    };
  }

  subscribe() {
    return true;
  }

  perform(args) {
    const {verb, schema, name} = args;
    const logic = this.map[verb];

    if (logic) {
      args.passwordFields = this.passwordFields(schema, name);

      logic(args);
    }
  }

  // helpers
  passwordFields(schema, name) {
    const fields = schema[0].schema[name];
    return _.filter(_.keys(fields), field => fields[field].type === PASSWORD);
  }

  encrypt(value) {
    return bcrypt.hashSync(value, this.config.saltRounds || DEFAULT_SALT_ROUNDS);
  }

  // handlers
  get(args) {
    if (!this.config.maskPasswordsInGet) {
      return;
    }

    const {stage, passwordFields, data} = args;
    if (stage !== AFTER) {
      return;
    }

    _.forEach(passwordFields, field => {
      _.forEach(data, item => {
        item[field] = PASSWORD_MASK;
      });
    });
  }

  post(args) {
    const {stage, req, passwordFields} = args;
    if (stage !== BEFORE) {
      return;
    }

    _.forEach(passwordFields, field => {
      req.body[field] = this.encrypt(req.body[field]);
    });
  }

  put(args) {
    const {stage, req, passwordFields} = args;
    if (stage !== BEFORE) {
      return;
    }

    _.forEach(passwordFields, field => {
      const value = req.body[field];
      if (value === PASSWORD_MASK) {
        req.body[field] = undefined; // eslint-disable-line
      } else {
        req.body[field] = this.encrypt(req.body[field]);
      }
    });
  }
}
