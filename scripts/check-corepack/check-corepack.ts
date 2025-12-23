import { execSync } from "node:child_process";

function run(cmd: string): boolean {
  try {
    execSync(cmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function log(msg: string) {
  console.log(`\n${msg}\n`);
}

function error(msg: string): never {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

function checkNodeVersion() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 16) {
    error("Node 版本过低，请升级到 Node >= 16.9");
  }
}

function checkCorepackExists() {
  if (!run("corepack --version")) {
    error("corepack 不可用，请升级 Node >= 16.9");
  }
}

function ensureCorepackEnabled() {
  if (run("corepack list")) {
    return;
  }

  log("⚠️ 检测到 corepack 未启用，正在自动启用...");
  try {
    execSync("corepack enable", { stdio: "inherit" });
  } catch {
    error("corepack 自动启用失败，请手动执行：corepack enable");
  }
}

function main() {
  checkNodeVersion();
  checkCorepackExists();
  ensureCorepackEnabled();
}

main();
