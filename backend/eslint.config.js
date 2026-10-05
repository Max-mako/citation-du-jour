module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        node: true,
        jest: true
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "semi": ["error", "always"]
    }
  }
];
