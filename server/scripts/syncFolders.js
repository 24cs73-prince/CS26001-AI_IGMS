import fs from "fs";
import path from "path";

const src1 = "c:/Users/jnpat/OneDrive/Desktop/sgp 5/mantra admin/AI_IGMS - week 5 _ antigravity - ai+paper genrator";
const src2 = "c:/Users/jnpat/OneDrive/Desktop/sgp 5/AI_IGMS - week 5 _ antigravity - updated at 29-08";

function copyFolderRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    if (file === "node_modules" || file === ".git") continue;
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursive(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

if (fs.existsSync(src2)) {
  console.log("Syncing server folder...");
  copyFolderRecursive(path.join(src1, "server"), path.join(src2, "server"));
  console.log("Syncing src folder...");
  copyFolderRecursive(path.join(src1, "src"), path.join(src2, "src"));
  console.log("✨ Synchronized both project directories successfully!");
} else {
  console.log("Target directory not found:", src2);
}
