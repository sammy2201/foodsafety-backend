// routes.ts
import { Router } from "express";
import * as controller from "../controllers/testResults.controller";

const router = Router();

router.post("/test-results", controller.create);
router.get("/test-results", controller.getAll);

export default router;
