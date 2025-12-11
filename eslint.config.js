import {defineConfig} from "@eslint/config-helpers";
import tsEslint from "typescript-eslint";
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from "eslint-config-prettier/flat";
import prettierRecommended from 'eslint-plugin-prettier/recommended';


export default defineConfig([
    {
        ignores: ['dist/', 'node_modules/', '**/*.d.ts', 'coverage/'],
    },
    tsEslint.configs.recommendedTypeChecked,
    tsEslint.configs.strictTypeChecked,
    tsEslint.configs.stylisticTypeChecked,
    importPlugin.flatConfigs.typescript,
    prettierRecommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    {
        "files": ["**/*.{js,mjs,cjs,ts,tsx}"],
        "rules": {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_",

                }
            ],
            "import/order": [
                "error",
                {
                    "alphabetize": {
                        "order": "asc",
                        "caseInsensitive": false
                    },
                    "groups": [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index"
                    ],
                    "newlines-between": "always",
                    "pathGroups": []
                }
            ]
        }
    }
]);
