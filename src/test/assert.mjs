export const assert = ({ caseDesc, first, check, excepted, tests, failed }) => {
  let results;
  tests++;
  const tooLong = 250;
  caseDesc = caseDesc ? `TESTCASE: ${caseDesc}\n` : "";
  let stepText = "";

  try {
    if (first) {
      const firstResult = first();
      const firstValue = JSON.stringify(firstResult);
      stepText = `Called first: ${first}, returned: ${firstValue}\n`;
    }

    const exceptValue = JSON.stringify(excepted);
    const excepText = `Exceptation is: ${
      exceptValue.length > tooLong ? "...too long..." : exceptValue
    }\n`;

    const res = check();
    const resultValue = JSON.stringify(res);
    const resultText = `${first ? "Then c" : "C"}alled: ${check}, \nReturned: ${
      resultValue && resultValue.length > tooLong
        ? "...too long..."
        : resultValue
    }\n`;

    const testResult = resultValue == exceptValue;

    const decision = `Result:     ${
      resultValue == exceptValue ? `📗ok📗\n` : `📕FAILED📕\n`
    }`;
    !testResult && failed++;

    console.warn(
      `----------------------TEST STEP: ${tests} Failed: ${failed}----------------`
    );
    console.warn(caseDesc + stepText + resultText + excepText + decision);
  } catch (e) {
    failed++;
    console.warn(
      `----------------------TEST STEP: ${tests} Failed: ${failed}----------------`
    );
    console.warn(`Test is 📕FAILED📕`);
    console.warn("Something went wrong with " + caseDesc);
    console.warn(
      `${first ? `Called first: ${first}, then c` : "C"}alled: ${check}`
    );
    console.warn(e);
  }
  return [results, tests, failed];
};

export const batchAssert = (cases) => {
  let tests = 0;
  let failed = 0;
  let results;
  cases.forEach((cs) => {
    [results, tests, failed] = assert({ ...cs, tests, failed });
  });
  console.warn(
    "--------------------------- TESTS ENDED ----------------------------"
  );
  console.warn(
    `${tests - failed} test was 📗ok📗\n${failed} test was failed📕FAILED📕\n`
  );
  console.warn(
    "--------------------------- TESTS ENDED ----------------------------"
  );
};
