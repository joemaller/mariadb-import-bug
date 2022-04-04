import { writeFileSync } from "fs";

let queries = [];
const max = 1024;

const filler = new Array(max).fill("a");

for (let x = 0; x < max; x++) {
  queries.push(`(${x + 75000},${x+87000},'key','${filler.join("")}')`);
}

const sql = "INSERT INTO `wp_postmeta` VALUES " + queries.join(",") + ";";

writeFileSync("filler.sql", sql);
