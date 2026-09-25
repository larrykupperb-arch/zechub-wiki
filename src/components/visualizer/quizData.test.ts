import { QUIZ_BEGINNER, QUIZ_INTERMEDIATE } from "./quizData";

const correctAnswer = (question: (typeof QUIZ_BEGINNER)[number]) =>
  question.options[question.correctIndex];

describe("Ironwood visualizer quiz data", () => {
  test("beginner pool question includes Ironwood as the NU6.3 pool", () => {
    const question = QUIZ_BEGINNER.find((item) =>
      item.question.includes("NU6.3 network upgrade"),
    );

    expect(question).toBeDefined();
    expect(question?.options).toContain("Ironwood");
    expect(question && correctAnswer(question)).toBe("Ironwood");
  });

  test("intermediate pool question captures Orchard's post-NU6.3 restriction", () => {
    const question = QUIZ_INTERMEDIATE.find((item) =>
      item.question.includes("After NU6.3 activation"),
    );

    expect(question).toBeDefined();
    expect(question && question.options[question.correctIndex]).toBe(
      "No new value may enter Orchard; funds can exit toward Ironwood",
    );
  });

  test("affected pool questions do not regress to privacy-ranking wording", () => {
    const affected = [...QUIZ_BEGINNER, ...QUIZ_INTERMEDIATE].filter((item) =>
      /pool|orchard|ironwood/i.test(item.question),
    );

    expect(affected.length).toBeGreaterThan(0);
    for (const question of affected) {
      expect(question.question).not.toMatch(/strongest privacy/i);
      expect(question.options.join(" ")).not.toMatch(/strongest privacy/i);
    }
  });
});
