export function evaluate({ studentAnswer, expectedAnswer }) {
  const student = parseInt(String(studentAnswer).replace(/\s/g, ''), 10);
  const correct = parseInt(String(expectedAnswer), 10);

  if (isNaN(student)) {
    return { is_correct: false, student_answer: studentAnswer, correct_answer: correct, delta: null, error: 'invalid_input' };
  }

  return {
    is_correct: student === correct,
    student_answer: student,
    correct_answer: correct,
    delta: student - correct,
    error: null,
  };
}
