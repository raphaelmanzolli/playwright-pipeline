export function generateUser() {
  const id = Date.now();

  return {
    fullName: `Test User ${id}`,
    email: `test${id}@example.com`,
    password: `Password${id}`,
  };
}