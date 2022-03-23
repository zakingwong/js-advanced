const ZakingPromise = require("../src/4.promise.js");

// --------Promise.resolve
ZakingPromise.resolve("ok").then((data) => {
  console.log(data, "resolve");
});

ZakingPromise.resolve(
  new ZakingPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("Zaking");
    }, 1000);
  })
).then((data) => {
  console.log(data, "resolve");
});

// Promise.reject
ZakingPromise.reject(
  new ZakingPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("Zaking");
    }, 1000);
  })
).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err, "reject");
  }
);

// catch
ZakingPromise.reject(
  new ZakingPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("Zaking");
    }, 1000);
  })
).catch((err) => {
  console.log(err, "catch-err");
});

// Promise.all
ZakingPromise.all([
  new ZakingPromise((resolve, reject) => {
    resolve("1");
  }),
  new ZakingPromise((resolve, reject) => {
    resolve("2");
  }),
]).then((data) => {
  console.log(data, "all");
});

// Promise.race
ZakingPromise.race([
  new ZakingPromise((resolve, reject) => {
    resolve("1");
  }),
  new ZakingPromise((resolve, reject) => {
    resolve("2");
  }),
]).then((data) => {
  console.log(data, "race");
});

//解决超时逻辑问题
let pw = new ZakingPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("data-zaking");
  }, 2000);
});

setTimeout(() => {
  pw.abort("超时");
}, 3000);

function wrapPromise(userPromise) {
  let abort;
  let internalPromise = new ZakingPromise((resolve, reject) => {
    abort = reject;
  });
  let racePromise = ZakingPromise.race([internalPromise, userPromise]);
  racePromise.abort = abort;
  return racePromise;
}
pw = wrapPromise(pw);
pw.then((data) => {
  console.log(data, "race-resolve");
}).catch((err) => {
  console.log(err, "race-reject");
});

// Promise.allSettled
Promise.allSettled([
  new Promise((resolve, reject) => {
    resolve("1");
  }),
  new Promise((resolve, reject) => {
    resolve("2");
  }),
]).then((data) => {
  console.log(data, "allSettled");
});

// Promise.finally
ZakingPromise.resolve("zaking-finally")
  .finnaly(() => {
    console.log("finally~~~");
  })
  .then((data) => {
    console.log(data, "finally-resolved");
  })
  .catch((err) => {
    console.log(err, "finally-rejected");
  });

ZakingPromise.resolve("zaking-finally")
  .finnaly(() => {
    setTimeout(() => {
      console.log("setTimeout-finally~~~");
    }, 1000);
  })
  .then((data) => {
    console.log(data, "setTimeout-finally-resolved");
  })
  .catch((err) => {
    console.log(err, "setTimeout-finally-rejected");
  });

// Promise.try

// Promise.any

// promisify

function promisify(fn) {
  return function (...args) {
    return new ZakingPromise((resolve, reject) => {
      fn(...args, function (err, data) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
}

function promisifyAll(obj) {
  let result = {};
  for (let key in obj) {
    result[key] =
      typeof obj[key] === "function" ? promisify(obj[key]) : obj[key];
  }
  return result;
}
