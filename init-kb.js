/**
 * 台灣景點知識庫初始化程式
 * 用於將台灣景點數據加入向量資料庫
 */

import { initTaiwanPlacesCollection } from "./lib/taiwan-places.js";
import { spinner } from "./utils/spinner.js";

async function main() {
  try {
    console.log("\n🚀 開始初始化台灣景點知識庫...\n");

    const spin = spinner("初始化中...").start();
    await initTaiwanPlacesCollection();
    spin.stop();

    console.log("\n✅ 知識庫初始化完成！\n");
  } catch (err) {
    console.error("\n❌ 初始化失敗:", err.message);
    process.exit(1);
  }
}

await main();
