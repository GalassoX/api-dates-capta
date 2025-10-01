import express from "express";
import constants from "./config";
import calculateRouter from "./routes/calculate";

const app = express();

app.use(calculateRouter);

app.listen(constants.PORT, () => {
  console.log(`API escuchando en http://localhost:${constants.PORT}`);
});
