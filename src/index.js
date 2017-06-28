import Password from './subscribers/password';

const defaultConfig = {
  maskPasswordsInGet: true,
};

export default options =>
  ({
    initialize: bitsConfig => {
      const config = {...defaultConfig, ...bitsConfig, ...options};

      return {
        subscribers: [
          {implementation: new Password(config)},
        ],
      };
    },
  });
