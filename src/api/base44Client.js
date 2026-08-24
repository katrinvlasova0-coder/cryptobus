const noop = async () => null;
const emptyList = async () => [];
const entityStub = new Proxy({}, {
  get: () => ({
    list: emptyList,
    filter: emptyList,
    get: noop,
    create: noop,
    update: noop,
    delete: noop,
  }),
});

export const base44 = {
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
    loginViaEmailPassword: noop,
    logout: noop,
    register: noop,
    redirectToLogin: noop,
  },
  entities: new Proxy({}, { get: () => entityStub }),
  functions: {
    invoke: async () => ({ data: null }),
  },
  integrations: {
    Core: {
      SendEmail: noop,
      UploadFile: noop,
      InvokeLLM: async () => ({ response: '' }),
    },
  },
};
