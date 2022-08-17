let tests = 0;
let failed = 0;

const assert = ({ caseDesc, first, check, excepted }) => {
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
  } catch {
    failed++;
    console.warn(
      `----------------------TEST STEP: ${tests} Failed: ${failed}----------------`
    );
    console.warn("Something went wrong with test case: " + caseDesc);
    console.warn(
      `${first ? `Called first: ${first}, then c` : "C"}alled: ${check}`
    );
  }
};

export default assert;
