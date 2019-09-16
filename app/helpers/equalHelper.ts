export const equal = (lvalue:any, rvalue:any, options:any) => {
  if (lvalue !== rvalue) {
    return options.inverse(this);
  }
  return options.fn(this);
};
