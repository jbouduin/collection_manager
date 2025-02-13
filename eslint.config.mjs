// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticTs from "@stylistic/eslint-plugin";
import stylisticJsx from "@stylistic/eslint-plugin-jsx";

export default tseslint.config(
  {
    plugins: {
      "@stylistic/ts": stylisticTs,
      "@stylistic/jsx": stylisticJsx
    }
  },
  {
    ignores: [
      "node_modules",
      "dist",
      "src/__tests__/init.ts"
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  stylisticTs.configs["all-flat"],
  stylisticJsx.configs["all-flat"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: ".",
      },
    },
    rules: {
      // es-lint rules
      "no-console": "error",
      "quotes": ["error", "double"],
      // typescript es-lint rules
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/array-type": ["error", { "default": "generic" }],
      // stylistic rules
      "@stylistic/indent": ["error", 2],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/semi": "error",
      "@stylistic/linebreak-style": "off",
      "@stylistic/lines-between-class-members": "off",
      "@stylistic/no-extra-parens": ["error", "all", { "ignoreJSX": "all" }],
      "@stylistic/object-curly-spacing": "off",
      "@stylistic/object-property-newline": ["error", { "allowAllPropertiesOnSameLine": true }],
      "@stylistic/padded-blocks": ["error", "never", { "allowSingleLineBlocks": true }],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
      "@stylistic/spaced-comment": ["error", "always", { "markers": ["#region", "#endregion"] }],
      "@stylistic/multiline-ternary": "off",
      // stylistic ts
      "@stylistic/ts/array-bracket-newline": ["error", "consistent"],
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/lines-around-comment": "off",
      // stylistic/jsx
      "@stylistic/jsx/jsx-indent-props": ["error", 2],
      "@stylistic/jsx/jsx-max-props-per-line": ["error", { "maximum": { "single": 3, "multi": 1 } }],
      "@stylistic/jsx/jsx-newline": "off",
      "@stylistic/jsx/jsx-one-expression-per-line": ["error", { "allow": "single-line" }]
    }
  }
);
