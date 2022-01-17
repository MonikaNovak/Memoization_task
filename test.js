const memoization = require("./memoizaton");
const expect = require("chai").expect;
const sinon = require("sinon");

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe("memoization", function () {
  it("should memoize function result", () => {
    memoization.memoize;
    let returnValue = 5;
    const testFunction = (key) => returnValue;

    //??? so we pass a function that accepts arguments 'key', then we pass resolver that is a function taking in 'key' from testfunction
    // and returns it and timeout. So the resolver will be some predefined function that defined the key. But this key should still be unique.
    // and if the key is array like the DateTime example, we should turn this daytime arguments still to unique hash

    //??? what if inbetween we test another function that has the same arguments, won't the key be the same even thugh the testfunction is different?

    const memoized = memoization.memoize(testFunction, 1000, (key) => key);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);

    returnValue = 10;

    // TODO it should also work with other
    // types then strings, if there are limitations to which types are possible please state them
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);
  });

  it("should delete the memoized function result after timeout", () => {
    let returnValue = 5;
    const testFunction = (key) => returnValue;
    const memoized = memoization.memoize(testFunction, 1000, (key) => key);

    // using recommended fake timer to jump 2000 ms ahead, so that
    // the cached result should already be delete
    clock = sinon.useFakeTimers();

    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);
    // (why wouldn't work if the clock is defined after expect?)

    returnValue = 15;
    clock.tick(2000);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(15);
  });

  it("should memoize function result with key input as number", () => {
    memoization.memoize;
    let returnValue = 20;
    const testFunction = (key) => returnValue;

    const memoized = memoization.memoize(testFunction, 1000, (key) => key);
    expect(memoized(123)).to.equal(20);

    returnValue = 30;

    expect(memoized(123)).to.equal(20);
  });

  it("should memoize function result without resolver", () => {
    let returnValue = 40;
    const testFunction = (key) => returnValue;

    const memoized = memoization.memoize(testFunction, 1000);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(40);

    returnValue = 50;

    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(40);
  });

  //   it("should refresh datetime result after timeout", () => {
  //     function addToTime(year, month, day) {
  //       return Date.now() + Date(year, month, day);
  //     }

  //     const memoized = memoization.memoize(
  //       addToTime(1, 11, 26),
  //       (year, month, day) => year + month + day,
  //       5000
  //     );

  //     // using recommended fake timer to jump 2000 ms ahead, so that
  //     // the cached result should already be delete
  //     clock = sinon.useFakeTimers();

  //     expect(memoized(1, 11, 26)).to.equal(1534252012350);
  //     // (why wouldn't work if the clock is defined after expect?)

  //     clock.tick(10000);
  //     expect(memoized(1, 11, 26)).to.equal(1534252159271);
  //   });

  // TODO additional tests required
});
