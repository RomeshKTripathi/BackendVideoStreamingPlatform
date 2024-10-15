import { ApiError } from "../utils/ApiError.js";

export const GlobalErrorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode ?? 500)
    .json(new ApiError(500, "Something went wrong !", err));
};
