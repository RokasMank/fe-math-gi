import { getStatusText, getStatusColor } from "../../utils/assignmentStatus";

describe("getStatusText", () => {
  it("returns Juodraštis for status 0", () => {
    expect(getStatusText(0)).toBe("Juodraštis");
  });

  it("returns Paskelbtas for status 1", () => {
    expect(getStatusText(1)).toBe("Paskelbtas");
  });

  it("returns Baigtas for status 2", () => {
    expect(getStatusText(2)).toBe("Baigtas");
  });

  it("returns Nežinoma for unknown status", () => {
    expect(getStatusText(99)).toBe("Nežinoma");
    expect(getStatusText(undefined)).toBe("Nežinoma");
  });
});

describe("getStatusColor", () => {
  it("returns gray.400 for status 0 (draft)", () => {
    expect(getStatusColor(0)).toBe("gray.400");
  });

  it("returns yellow.400 for status 1 (published)", () => {
    expect(getStatusColor(1)).toBe("yellow.400");
  });

  it("returns green.400 for status 2 (finished)", () => {
    expect(getStatusColor(2)).toBe("green.400");
  });

  it("returns gray.400 as default for unknown status", () => {
    expect(getStatusColor(99)).toBe("gray.400");
    expect(getStatusColor(undefined)).toBe("gray.400");
  });
});

