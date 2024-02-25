import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    // app.on("error", (error)=>{
    //   console.log("ERROR: ", error);
    //   throw error
    // }) // checking if error occurs {Listening for server errors}

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`DB Connection failed :: ${error}`);
  });
