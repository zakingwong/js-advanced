const ZakingPromise = require("../src/3.promise.js");
//1.  If promise and x refer to the same object, reject promise with a TypeError as the reason.
let p1 = new ZakingPromise((resolve, reject) => {
  resolve();
}).then(() => {
  return p1;
});

p1.then(
  () => {},
  (err) => {
    console.log(err);
  }
);

// 2
const zp1 = new ZakingPromise((resolve, reject) => {
  resolve("ok");
}).then((data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
});

zp1.then(
  (data) => {
    console.log(data, "zp1-resolve");
  },
  (err) => {
    console.log(data, "zp1-reject");
  }
);

// 3

const zp2 = new ZakingPromise((resolve, reject) => {
  resolve("ok");
}).then((data) => {
  return new ZakingPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        new ZakingPromise((resolve, reject) => {
          setTimeout(() => {
            resolve("zaking");
          }, 1000);
        })
      );
    }, 1000);
  });
});

zp2.then(
  (data) => {
    console.log(data, "zp2-resolve");
  },
  (err) => {
    console.log(data, "zp2-reject");
  }
);

// 4
const zp3 = new ZakingPromise((resolve, reject) => {
  resolve("zp3");
})
  .then()
  .then()
  .then()
  .then((data) => {
    console.log(data);
  });

const zp4 = new ZakingPromise((resolve, reject) => {
  reject("zp4");
})
  .then(null)
  .then(null)
  .then(null)
  .then(
    (data) => {
      console.log(data);
    },
    (err) => {
      console.log(err, "zp4-reject");
    }
  );
