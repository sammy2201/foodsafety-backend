// services/testResults.service.ts
import { TestResult } from "../models/TestResult";
import { ProductionLine } from "../models/ProductionLine";
import { Facility } from "../models/Facility";

export const createTestResult = async (data: any) => {
  const { facilityName, productionLineName, cfuCount, location, testedAt } =
    data;

  // Validate required fields
  if (!productionLineName || cfuCount === undefined || !location || !testedAt) {
    throw new Error("Missing required fields");
  }

  if (cfuCount < 0) {
    throw new Error("CFU count must be >= 0");
  }

  // Optional: handle facility first
  let facility;
  if (facilityName) {
    facility = await Facility.findOne({ where: { name: facilityName } });
    if (!facility) {
      facility = await Facility.create({ name: facilityName });
    }
  }

  // Handle production line
  let line;
  if (facility) {
    line = await ProductionLine.findOne({
      where: { name: productionLineName, facilityId: facility.id },
    });
  } else {
    line = await ProductionLine.findOne({
      where: { name: productionLineName },
    });
  }

  if (!line) {
    line = await ProductionLine.create({
      name: productionLineName,
      facilityId: facility?.id ?? null,
    });
  }

  // Create the test result
  return TestResult.create({
    productionLineId: line.id,
    cfuCount,
    location,
    testedAt: new Date(testedAt),
  });
};

export const getTestResultsSimple = async (allResults: any[], query: any) => {
  const { facilityId, productionLineId, from, to } = query;

  let filtered = allResults;

  // Filter by production line ID
  if (productionLineId) {
    filtered = filtered.filter((r) => r.productionLineId === productionLineId);
  }

  // Filter by facility ID
  if (facilityId) {
    filtered = filtered.filter((r) => r.facilityId === facilityId);
  }

  // Filter by date range
  if (from) {
    const fromDate = new Date(from);
    filtered = filtered.filter((r) => new Date(r.testedAt) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    filtered = filtered.filter((r) => new Date(r.testedAt) <= toDate);
  }

  return filtered;
};
