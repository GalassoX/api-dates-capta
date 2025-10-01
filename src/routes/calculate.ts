import { Router } from "express";
import { calculateTime } from "../controllers/calculateController";

const router: Router = Router();

router.get("/calculate", calculateTime);

export default router;