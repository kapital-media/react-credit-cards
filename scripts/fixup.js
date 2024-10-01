// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promisify } = require("util");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require("child_process");

const run = promisify(exec);

const mjsPackage = path.join(__dirname, "../dist/mjs/package.json");
const cjsPackage = path.join(__dirname, "../dist/cjs/package.json");
try {
  fs.writeFileSync(mjsPackage, JSON.stringify({ type: "module" }, null, 2));
  fs.writeFileSync(cjsPackage, JSON.stringify({ type: "commonjs" }, null, 2));
} catch (e) {
  console.error(e);
}

console.log("Building styles");

run("rm -rf .tmp/")
  .then(() => run("sass src/styles.scss .tmp/styles.css"))
  .then(() => run("postcss .tmp/styles.css --use autoprefixer --no-map -d .tmp/"))
  .then(() => run("mv .tmp/styles.css .tmp/styles-compiled.css"))
  .then(() => run("cp .tmp/styles-compiled.css dist"))
  .then(() => run("cp src/styles.scss dist"))
  .then(() => console.log("✔ Styles have been build"))
  .catch((err) => {
    console.error(err);
  });
