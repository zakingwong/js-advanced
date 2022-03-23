const Promise = require("../src/1.promise.js");
const p1 = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    resolve("chenggong");
  }, 1000);
  //   throw new Error("throw error");
  //   reject("shibai");
  //   resolve("chenggong");
});

console.log(2);
p1.then(
  (value) => {
    console.log("成功", value);
  },
  (reason) => {
    console.log("失败", reason);
  }
);

p1.then(
  (value) => {
    console.log("成功", value);
  },
  (reason) => {
    console.log("失败", reason);
  }
);
