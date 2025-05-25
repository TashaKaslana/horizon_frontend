import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["src/api/client/sdk.gen.ts", "src/api/client/zod.gen.ts", "src/api/client/sdk.gen.ts"],
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["src/api/client/transformer.gen.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
