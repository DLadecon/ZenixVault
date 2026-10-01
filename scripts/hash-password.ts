#!/usr/bin/env node
/**
 * Generates the value for ADMIN_PASSWORD_HASH_B64 in your .env file.
 * Usage: npm run hash-password
 */
import bcrypt from "bcryptjs";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const password = await rl.question("Choose an admin password: ");
  rl.close();

  if (password.length < 8) {
    console.error("\nUse at least 8 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const b64 = Buffer.from(hash, "utf8").toString("base64");

  console.log("\nAdd this line to your .env file:\n");
  console.log(`ADMIN_PASSWORD_HASH_B64="${b64}"`);
}

main();
