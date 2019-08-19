export const equal = (lvalue, rvalue, options) => {
    if (lvalue !== rvalue) {
      return options.inverse(this);
    }
    return options.fn(this);
  };