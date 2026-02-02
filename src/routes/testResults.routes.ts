// routes.ts
import { Router } from "express";
import { create, getAll } from "../controllers/testResults.controller";

const router = Router();

router.post("/test-results", create);
router.get("/test-results", getAll);

export default router;
