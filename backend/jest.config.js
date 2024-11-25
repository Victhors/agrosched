module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/setupTests.js"],
  testMatch: ["**/src/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
};
