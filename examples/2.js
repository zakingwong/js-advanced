const Promise = require("../src/2.promise.js");

// const p1 = new Promise((resolve, reject) => {
//   resolve(100);
// });

// let p2 = p1.then((value) => {
//   return value;
// });

// p2.then(
//   (value) => {
//     console.log(value, "p2-resolve");
//   },
//   (reason) => {
//     console.log(reason, "p2-reject");
//   }
// );
// console.log("------------------");
// (function () {
//   const p1 = new Promise((resolve, reject) => {
//     reject(100);
//   });

//   let p2 = p1.then(
//     (value) => {
//       return value;
//     },
//     (err) => {
//       console.log(err);
//     }
//   );

//   p2.then(
//     (value) => {
//       console.log(value, "p2-resolve");
//     },
//     (reason) => {
//       console.log(reason, "p2-reject");
//     }
//   );
// })();

// (function () {
//   const p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("settimeout");
//     }, 1000);
//   });

//   let p2 = p1.then((value) => {
//     // return value;
//     throw new Error("error");
//   });

//   p2.then(
//     (value) => {
//       console.log(value, "p2-resolve");
//     },
//     (reason) => {
//       console.log(reason, "p2-reject");
//     }
//   );
// })();

(function () {
  const p1 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    resolve("settimeout");
    //   }, 1000);
  });

  let p2 = p1.then((value) => {
    return new Promise((resolve, reject) => {});
  });

  p2.then(
    (value) => {
      console.log(value, "p2-resolve");
    },
    (reason) => {
      console.log(reason, "p2-reject");
    }
  );
})();
