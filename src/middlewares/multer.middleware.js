import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, "./public/temp");
  },
  filename: function (req, file, next) {
    next(null, file.originalname);
  },
});

export const upload = multer({ storage });
