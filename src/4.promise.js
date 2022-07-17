const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

function resolvePromise(promise, x, resolve, reject) {
  if (promise == x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<ZakingPromise>")
    );
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called = false;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

class Promise {
  constructor(excutor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.onResolvedCallbacks.forEach((cb) => cb(this.value));
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
      }
    };
    try {
      excutor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };

    let p = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(p, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(p, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(p, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(p, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return p;
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }
  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  }
  catch(errCb) {
    return this.then(null, errCb);
  }
  static all(promises) {
    let result = [];
    let times = 0;
    return new Promise((resolve, reject) => {
      function processResult(data, index) {
        result[index] = data;
        if (++times === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        Promise.resolve(promise).then((data) => {
          processResult(data, i);
        }, reject);
      }
    });
  }
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let promise = promises[i];
        Promise.resolve(promise).then(resolve, reject);
      }
    });
  }
  static allSettled(promises) {
    let result = [];
    let times = 0;
    return new Promise((resolve, reject) => {
      function processResult(data, index, status) {
        result[index] = { status, value: data };
        if (++times === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        Promise.resolve(promise).then(
          (data) => {
            processResult(data, i, "fulfilled");
          },
          (err) => {
            processResult(err, i, "rejected");
          }
        );
      }
    });
  }
  finally(finallyCallback) {
    let p = this.constructor;
    return this.then(
      (data) => {
        return p.resolve(finallyCallback()).then(() => data);
      },
      (err) => {
        return p.resolve(finallyCallback()).then(() => {
          throw err;
        });
      }
    );
  }
}

Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
