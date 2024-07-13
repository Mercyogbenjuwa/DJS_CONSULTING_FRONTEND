export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate password
export function validatePassword(password: string): boolean {
  // Regex explanation:
  // ^(?=.*[A-Z])    - At least one capital letter
  // (?=.*[a-z])     - At least one lowercase letter
  // (?=.*\d)        - At least one digit
  // (?=.*[!@#$%^&*]) - At least one special character
  // .{8,}           - At least 8 characters long
  // (?!password$)   - Not equal to the word "password"
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[^\s]).{8,}$/;
  return passwordRegex.test(password) && password.toLowerCase() !== "password";
}
