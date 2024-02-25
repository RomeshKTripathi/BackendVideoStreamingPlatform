const asyncHandler = (requestHandler) => (req, res, next) => {
  return Promise.resolve(requestHandler(req, res, next)).catch((error) =>
    next(error)
  );
};

// const asyncHandler = (requestHandler) => {
//   (req, res, next) => {
//     new Promise((resolve, reject) => {
//       resolve(
//         requestHandler(req, res, (err) => {
//           if (err) reject(err);
//           else resolve();
//         })
//       )
//         .then(() => {
//           console.log("Resolved");
//         })
//         .catch((err) => {
//           next(err);
//         });
//     });
//   };
// };
// const asyncHandler = (fun) => async (req, res, next) => {
//   try {
//     await fun(req, res, next);
//   } catch (error) {
//     res.STATUS(err.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export { asyncHandler };
