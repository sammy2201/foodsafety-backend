// services/testResults.service.ts
import { TestResult } from "../models/TestResult";
import { ProductionLine } from "../models/ProductionLine";
import { Facility } from "../models/Facility";

type TestResultWithRelations = TestResult & {
  ProductionLine?: {
    id: string;
    name: string;
    Facility?: {
      id: string;
      name: string;
    };
  };
};

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

export const getTestResults = async (query: any) => {
  const { facilityId, productionLineId, from, to } = query;

  // 1. Fetch all test results including relations
  const allResults: TestResultWithRelations[] = await TestResult.findAll({
    include: [
      {
        model: ProductionLine,

        include: [
          {
            model: Facility,
          },
        ],
      },
    ],
    order: [["testedAt", "DESC"]],
  });

  console.log(allResults.map((r) => r.toJSON()));

  // 2. Apply filters in-memory using array.filter
  let filtered = allResults;

  if (facilityId) {
    filtered = filtered.filter(
      (r) => r.ProductionLine?.Facility?.id === facilityId,
    );
  }

  if (productionLineId) {
    filtered = filtered.filter((r) => r.productionLineId === productionLineId);
  }

  if (from) {
    const fromDate = new Date(from);
    filtered = filtered.filter((r) => new Date(r.testedAt) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    filtered = filtered.filter((r) => new Date(r.testedAt) <= toDate);
  }

  return {
    data: filtered,
    meta: { total: filtered.length },
  };
};
