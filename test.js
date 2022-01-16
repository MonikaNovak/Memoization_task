const memoization = require("./memoizaton");
const expect = require("chai").expect;
const sinon = require("sinon");

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe("memoization", function () {
  it("should memoize function result", () => {
    memoization.memoize;
    let returnValue = 5;
    const testFunction = (key) => returnValue;

    const memoized = memoization.memoize(testFunction, (key) => key, 1000);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);

    returnValue = 10;

    // TODO it should also work with other
    // types then strings, if there are limitations to which types are possible please state them
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);
  });

  it("should delete the memoized function result after timeout", () => {
    let returnValue = 5;
    const testFunction = (key) => returnValue;
    const memoized = memoization.memoize(testFunction, (key) => key, 1000);

    // using recommended fake timer to jump 2000 ms ahead, so that
    // the cached result should already be delete
    clock = sinon.useFakeTimers();

    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);
    // (why wouldn't work if the clock is defined after expect?)

    returnValue = 15;
    clock.tick(2000);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(15);
  });

  // TODO test for no resolver

  // TODO additional tests required
});
