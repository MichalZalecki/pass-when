# pass-when

Functional and more robust `switch` statement replacement.

```js
pass(8)
  .when(v => v > 10).to(v => `${v} is greater than 10`)
  .when(v => v < 10).to(v => `${v} is lower than 10`)
  .or().to(() => "is 10")
  .resolve();

// 8 is lower than 10
```

The idea behind it was to create simple way to solve problems of `switch`
statement and turn it from statement to an expression. It works nicely when
you're creating Redux reducer or writing custom validation with library like
`validator` (what I'm doing when using `redux-form`).

## Install

```bash
npm install --save pass-when
```

## Usage

* resolve value with functor passed to `to` after first matched `when`
* resolve value with functor passed to `to` after `or` as default

```js
import pass from "pass-when";

function compute(value) {
  return pass(value)
    .when(v => v > 10).to(v => `${v} is greater than 10`)
    .when(v => v < 10).to(v => `${v} is lower than 10`)
    .or().to(() => "is 10")
    .resolve();
}

compute(12); // 12 is greater than 10
compute(8);  // 8 is lower than 10
compute(10);  // is 10
```

* allows for additional conditions with `andWhen` and `orWhen`

```js
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

compute(201); // 201 is greater than 100 and odd
compute(200); // 200 is greater than 100 and even
compute(52);  // 52 is 50 - 100
compute(51);  // 51 is lower than 50 or odd
compute(10);  // 10 is lower than 50 or odd
```

* can resolve to promise

```js
const response = { status: 404, data: { foo: "bar" } };
pass(response)
  .when(({ status }) => status >= 400 && status < 600)
    .to(res => ({ ...res, error: true }))
  .or()
    .to(res => ({ ...res, error: false }))
  .resolveToPromise()
  .then(res => {
    // { status: 404, data: { foo: "bar" }, error: true }
  });
```

* has negative operators whenNot, andWhenNot and orWhenNot corresponding to when,
andWhen and orWhen

```js
function compute(value) {
  return pass(value)
    .whenNot(v => v <= 100)
    .andWhenNot(v => v % 2 === 1)
      .to(v => `${v} is greater than 100 and even`)
    .whenNot(v => v <= 100)
    .andWhenNot(v => v % 2 === 0)
      .to(v => `${v} is greater than 100 and odd`)
    .whenNot(v => v >= 50)
    .orWhenNot(v => v % 2 === 0)
      .to(v => `${v} is lower than 50 or odd`)
    .or()
      .to(v => `${v} is 50 - 100`)
    .resolve();
}

compute(201); // 201 is greater than 100 and odd
compute(200); // 200 is greater than 100 and even
compute(52);  // 52 is 50 - 100
compute(51);  // 51 is lower than 50 or odd
compute(10);  // 10 is lower than 50 or odd
```

## Todo

* Alternative syntax `when(a, b)=>when(a).to(b)` ([issues/1](https://github.com/MichalZalecki/pass-when/issues/1))
