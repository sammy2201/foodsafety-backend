import { Request, Response } from "express";
import {
  createTestResult,
  getTestResults,
} from "../services/testResults.service";

export const create = async (req: Request, res: Response) => {
  try {
    const result = await createTestResult(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const results = await getTestResults(req.query);
    res.json(results);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
