// very small heuristic — replace with zxcvbn later if you want
export function passwordScore(pw: string): { score: number, label: string } {
  if (!pw) return { score: 0, label: 'Empty' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Very weak' };
  if (score === 2) return { score, label: 'Weak' };
  if (score === 3) return { score, label: 'Medium' };
  if (score === 4) return { score, label: 'Strong' };
  return { score, label: 'Excellent' };
}