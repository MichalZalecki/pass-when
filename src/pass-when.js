function pass(what) {
  let lastMatches = null;
  let result = null;

  const afterPassContext = {
    when,
  };

  const afterWhenContext = {
    orWhen,
    andWhen,
    to,
  };

  const afterToContext = {
    when,
    or,
    resolve,
    resolveToPromise,
  };

  const afterOrContext = {
    to,
  };

  function when(fn) {
    if (typeof fn !== "function") {
      throw new Error("first argument passed to \"when\" must be a function");
    }
    lastMatches = !result && fn(what);
    return afterWhenContext;
  }

  function andWhen(fn) {
    if (typeof fn !== "function") {
      throw new Error("first argument passed to \"andWhen\" must be a function");
    }
    lastMatches = !result && lastMatches && fn(what);
    return afterWhenContext;
  }

  function orWhen(fn) {
    if (typeof fn !== "function") {
      throw new Error("first argument passed to \"orWhen\" must be a function");
    }
    if (!result && fn(what)) {
      lastMatches = true;
    }
    return afterWhenContext;
  }

  function to(fn) {
    if (typeof fn !== "function") {
      throw new Error("first argument passed to \"to\" must be a function");
    }
    if (lastMatches) {
      result = fn;
    }
    return afterToContext;
  }

  function or() {
    lastMatches = !result && !lastMatches;
    return afterOrContext;
  }

  function resolve() {
    if (typeof result !== "function") {
      throw new Error("at least one \"when\" case must match before resolve");
    }
    return result(what);
  }

  function resolveToPromise() {
    if (typeof result !== "function") {
      throw new Error("at least one \"when\" case must match before resolveToPromise");
    }
    return Promise.resolve(result(what));
  }

  return afterPassContext;
}

export default pass;
