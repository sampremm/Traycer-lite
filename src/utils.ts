import * as fs from "fs-extra";
import * as path from "path";

export function safeWriteFile(filePath: string, content: string) {
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content, { encoding: "utf-8" });
}

export function nowIso() {
  return new Date().toISOString();
}
