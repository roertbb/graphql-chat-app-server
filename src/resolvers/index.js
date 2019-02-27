const resolver = {
  Query: {
    hello: async (parent, agrs, context) => {
      return 'hello world';
    }
  }
};

export default [resolver];
