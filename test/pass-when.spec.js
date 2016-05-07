import chai from "chai";
import pass from "../lib/pass-when.js";

chai.expect();

const expect = chai.expect;

describe("pass-when", () => {
  it("resolve value with functor passed to \"to\" after first matched \"when\"", () => {
    function compute(value) {
      return pass(value)
        .when(v => v > 10)
          .to(v => `${v} is greater than 10`)
        .when(v => v < 10)
          .to(v => `${v} is lower than 10`)
        .when(v => v === 10)
          .to(() => "is 10")
        .resolve();
    }

    expect(compute(11)).to.equal("11 is greater than 10");
    expect(compute(9)).to.equal("9 is lower than 10");
    expect(compute(10)).to.equal("is 10");
  });

  it("resolve value with functor passed to \"to\" after \"or\" as default", () => {
    function compute(value) {
      return pass(value)
        .when(v => v > 10)
          .to(v => `${v} is greater than 10`)
        .when(v => v < 10)
          .to(v => `${v} is lower than 10`)
        .when(v => v === 10)
          .to(() => "is 10")
        .resolve();
    }

    expect(compute(11)).to.equal("11 is greater than 10");
    expect(compute(9)).to.equal("9 is lower than 10");
    expect(compute(10)).to.equal("is 10");
  });

  it("allows for additional conditions with \"andWhen\" and \"orWhen\"", () => {
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

    expect(compute(201)).to.equal("201 is greater than 100 and odd");
    expect(compute(200)).to.equal("200 is greater than 100 and even");
    expect(compute(52)).to.equal("52 is 50 - 100");
    expect(compute(51)).to.equal("51 is lower than 50 or odd");
    expect(compute(10)).to.equal("10 is lower than 50 or odd");
  });

  it("can resolve to promise", () => {
    const response = { status: 404, data: { foo: "bar" } };
    return pass(response)
      .when(({ status }) => status >= 400 && status < 600)
        .to(res => ({ ...res, error: true }))
      .or()
        .to(res => ({ ...res, error: false }))
      .resolveToPromise(res => {
        expect(res.error).to.be(true);
      });
  });
});
