import { buildQueryString } from "../../utils/buildQueryString";

describe("buildQueryString", () => {
  it("returns empty string when all values are empty/null/undefined", () => {
    expect(buildQueryString({ code: "", gender: undefined, class: null })).toBe("");
  });

  it("includes only defined non-empty values", () => {
    const result = buildQueryString({ code: "ABC", gender: "", school: "LT" });
    expect(result).toContain("code=ABC");
    expect(result).toContain("school=LT");
    expect(result).not.toContain("gender");
  });

  it("URL-encodes special characters", () => {
    const result = buildQueryString({ name: "Jonas Jonaitis" });
    expect(result).toBe("name=Jonas%20Jonaitis");
  });

  it("joins multiple params with &", () => {
    const result = buildQueryString({ a: "1", b: "2" });
    expect(result).toBe("a=1&b=2");
  });

  it("handles numeric zero as a valid value", () => {
    const result = buildQueryString({ page: 0 });
    expect(result).toBe("page=0");
  });
});

