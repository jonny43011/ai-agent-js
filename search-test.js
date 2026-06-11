/**
 * 台灣景點知識庫搜尋測試程式
 * 用 3 種不同問法測試搜尋功能
 */

import { searchTaiwanPlaces } from "./lib/taiwan-places.js";
import { spinner } from "./utils/spinner.js";

const testQueries = [
  "我想去看日出和雲海，適合去哪個景點？",
  "哪個地方有溫泉和美麗的花卉景觀？",
  "最南端的海邊度假區在哪裡，可以做什麼水上活動？",
];

async function main() {
  try {
    console.log("\n🔍 台灣景點知識庫搜尋測試\n");
    console.log("=".repeat(60));

    for (let i = 0; i < testQueries.length; i++) {
      console.log(`\n【測試 ${i + 1}】`);
      console.log(`問題：${testQueries[i]}`);

      const spin = spinner("搜尋中...").start();
      const results = await searchTaiwanPlaces(testQueries[i], 5);
      spin.stop();

      console.log(`\n結果：\n`);
      for (const [j, result] of results.entries()) {
        const relevancePercentage = (result.score * 100).toFixed(1);
        const relevanceBar =
          "█".repeat(Math.floor(result.score * 10)) +
          "░".repeat(10 - Math.floor(result.score * 10));

        console.log(
          `  ${j + 1}. 【${result.name}】 相似度 ${relevancePercentage}% [${relevanceBar}]`
        );
        console.log(`     ${result.content.substring(0, 80)}...`);
      }

      console.log("\n" + "-".repeat(60));
    }

    console.log("\n✅ 搜尋測試完成！\n");
  } catch (err) {
    console.error("\n❌ 測試失敗:", err.message);
    process.exit(1);
  }
}

await main();
