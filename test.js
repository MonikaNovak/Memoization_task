const memoization = require("./memoization");
const expect = require("chai").expect;
const sinon = require("sinon");

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe("memoization", function () {
  it("should memoize function result", () => {
    memoization.memoize;
    let returnValue = 5;
    const testFunction = (key) => returnValue;

    const memoized = memoization.memoize(testFunction, 1000, (key) => key);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);

    returnValue = 10;
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b776")).to.equal(5);
  });

  it("should delete the memoized function result after timeout", () => {
    let returnValue = 5;
    const testFunction = (key) => returnValue;
    const memoized = memoization.memoize(testFunction, 1000, (key) => key);

    // using recommended fake timer to jump 2000 ms ahead
    clock = sinon.useFakeTimers();

    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b777")).to.equal(5);

    returnValue = 15;
    clock.tick(2000);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b777")).to.equal(15);
  });

  it("should memoize function result with key input as number", () => {
    let returnValue = 20;
    const testFunction = (key) => returnValue;

    const memoized = memoization.memoize(testFunction, 1000, (key) => key);
    expect(memoized(123)).to.equal(20);
  });

  it("should memoize function result without resolver", () => {
    let returnValue = 40;
    const testFunction = (key) => returnValue;

    const memoized = memoization.memoize(testFunction, 1000);
    expect(memoized("c544d3ae-a72d-4755-8ce5-d25db415b778")).to.equal(40);
  });

  it("should memoize different functions with the same arguments", () => {
    let returnValue = 60;
    const testFunction1 = (key) => 1 + 2;
    const testFunction2 = (key) => returnValue;

    const memoized1 = memoization.memoize(testFunction1, 1000);
    expect(memoized1("some string")).to.equal(3);

    returnValue = 70;
    const memoized2 = memoization.memoize(testFunction2, 1000);
    expect(memoized2("some string")).to.equal(70);
  });

  it("should generate cache key for different parameter types", () => {
    let returnValue = 80;
    const testFunction1 = (key) => returnValue;
    const objectPar = {
      firstName: "Peter",
      lastName: "Peterson",
    };

    const memoized1 = memoization.memoize(testFunction1, 1000);
    expect(memoized1(() => "callback return value")).to.equal(80);
    expect(memoized1(objectPar)).to.equal(80);
    expect(memoized1(1.2)).to.equal(80);
    expect(memoized1("some other string")).to.equal(80);
    expect(memoized1(true)).to.equal(80);
  });
});
