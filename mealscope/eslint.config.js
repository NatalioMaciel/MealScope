import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
        },
        plugins: {
            prettier: pluginPrettierRecommended.plugins.prettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...pluginPrettierRecommended.rules,
            "prettier/prettier": ["error", { endOfLine: "auto" }],
        },
    },
    prettier,
];
