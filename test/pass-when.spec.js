import chai from "chai";
import pass from "../lib/pass-when.js";

chai.expect();

const expect = chai.expect;

describe("pass-when", () => {
  it("can be used as switch statement replacement", () => {
    const state = { counter: 5 };
    const action = { type: "DECREMENT_COUNTER", payload: 10 };

    pass(action)
      .when(({ type }) => type === "INCREMENT_COUNTER")
        .to(({ payload }) => state.counter += payload)
      .when(({ type }) => type === "DECREMENT_COUNTER")
        .to(({ payload }) => state.counter -= payload)
      .resolve();

    expect(state).to.deep.equal({ counter: -5 });
  });

  it("can be used as switch statement replacement but it's an expression", () => {
    const state = { counter: 5 };
    const action = { type: "DECREMENT_COUNTER", payload: 10 };

    const newState = pass(action)
      .when(({ type }) => type === "INCREMENT_COUNTER")
        .to(({ payload }) => ({ ...state, counter: state.counter + payload }))
      .when(({ type }) => type === "DECREMENT_COUNTER")
        .to(({ payload }) => ({ ...state, counter: state.counter - payload }))
      .resolve();

    expect(newState).to.deep.equal({ counter: -5 });
  });

  it("can resolve to promise", done => {
    const state = { counter: 5 };
    const action = { type: "DECREMENT_COUNTER", payload: 10 };

    pass(action)
      .when(({ type }) => type === "INCREMENT_COUNTER")
        .to(({ payload }) => ({ ...state, counter: state.counter + payload }))
      .when(({ type }) => type === "DECREMENT_COUNTER")
        .to(({ payload }) => ({ ...state, counter: state.counter - payload }))
      .resolveToPromise()
      .then(newState => {
        expect(newState).to.deep.equal({ counter: -5 });
        done();
      });
  });

  it("can resolve default with or", done => {
    const state = { counter: 5 };
    const action = { type: "PAYMET_REQUEST" };

    pass(action)
      .when(({ type }) => type === "INCREMENT_COUNTER")
        .to(({ payload }) => ({ ...state, counter: state.counter + payload }))
      .when(({ type }) => type === "DECREMENT_COUNTER")
        .to(({ payload }) => ({ ...state, counter: state.counter - payload }))
      .or()
        .to(() => state)
      .resolveToPromise()
      .then(newState => {
        expect(newState).to.deep.equal(state);
        done();
      });
  });

  it("allows for chaining when with andWhen or orWhen for more complicated conditions", () => {
    function compute(value) {
      return pass(value)
        .when(v => v > 100)
        .andWhen(v => v % 2 === 0)
          .to(v => `${v} is greater than 100 and even`)
        .when(v => v > 100)
        .andWhen(v => v % 2 === 1)
          .to(v => `${v} is greater than 100 and odd`)
        .when(v => v < 50)
        .orWhen(v => v % 2 === 1)
          .to(v => `${v} is lower than 50 or odd`)
        .or()
          .to(v => `${v} is 50 - 100`)
        .resolve();
    }

    expect(compute(10)).to.equal("10 is lower than 50 or odd");
    expect(compute(51)).to.equal("51 is lower than 50 or odd");
    expect(compute(52)).to.equal("52 is 50 - 100");
    expect(compute(200)).to.equal("200 is greater than 100 and even");
    expect(compute(201)).to.equal("201 is greater than 100 and odd");
  });
});
