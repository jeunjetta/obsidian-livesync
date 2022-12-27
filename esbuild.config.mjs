import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import fs from "node:fs";
const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";
const manifestJson = JSON.parse(fs.readFileSync("./manifest.json"));
const packageJson = JSON.parse(fs.readFileSync("./package.json"));
const updateInfo = JSON.stringify(fs.readFileSync("./updates.md") + "");
esbuild
    .build({
        banner: {
            js: banner,
        },
        entryPoints: ["src/main.ts"],
        bundle: true,
        define: {
            "MANIFEST_VERSION": `"${manifestJson.version}"`,
            "PACKAGE_VERSION": `"${packageJson.version}"`,
            "UPDATE_INFO": `${updateInfo}`,
            "global":"window",
        },
        external: ["obsidian", "electron", "crypto"],
        format: "cjs",
        watch: !prod,
        target: "es2018",
        logLevel: "info",
        sourcemap: prod ? false : "inline",
        treeShaking: true,
        platform: "browser",
        plugins: [
            sveltePlugin({
                preprocess: sveltePreprocess(),
                compilerOptions: { css: true },
            }),
        ],
        outfile: "main.js",
    })
    .catch(() => process.exit(1));
