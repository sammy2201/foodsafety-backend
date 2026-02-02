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

  // handle facility first
  let facility;
  if (facilityName) {
    facility = await Facility.findOne({
      where: { name: facilityName.toLowerCase() },
    });
    if (!facility) {
      facility = await Facility.create({ name: facilityName.toLowerCase() });
    }
  }

  // handle production line
  let line;
  if (facility) {
    line = await ProductionLine.findOne({
      where: {
        name: productionLineName.toLowerCase(),
        facilityId: facility.id,
      },
    });
    if (!line) {
      line = await ProductionLine.create({
        name: productionLineName.toLowerCase(),
        facilityId: facility.id,
      });
    }
  }

  if (line === undefined) {
    throw new Error("Production line could not be saved");
  }

  // create the test result
  return TestResult.create({
    productionLineId: line.id,
    cfuCount,
    location,
    testedAt: new Date(testedAt),
  });
};

export const getTestResults = async (query: any) => {
  const { facilityId, productionLineId, from, to } = query;

  // fetch all test results
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

  // Apply filters
  let filtered = allResults;

  if (facilityId) {
    filtered = filtered.filter(
      (i) => i.ProductionLine?.Facility?.id === facilityId,
    );
  }

  if (productionLineId) {
    filtered = filtered.filter((i) => i.productionLineId === productionLineId);
  }

  if (from) {
    const fromDate = new Date(from);
    filtered = filtered.filter((i) => new Date(i.testedAt) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    filtered = filtered.filter((i) => new Date(i.testedAt) <= toDate);
  }

  return {
    data: filtered,
    meta: { total: filtered.length },
  };
};
