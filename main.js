import { input } from "@inquirer/prompts";
import {
  initTaiwanPlacesCollection,
  searchTaiwanPlaces,
  taiwanPlacesData,
} from "./lib/taiwan-places.js";
import { spinner } from "./utils/spinner.js";

async function showMenu() {
  console.log("\n🏔️  台灣風景名勝向量資料庫系統");
  console.log("================================");
  console.log("1. 初始化知識庫");
  console.log("2. 搜尋景點");
  console.log("3. 顯示所有景點");
  console.log("4. 退出");
  console.log();

  const choice = (await input({ message: "請選擇操作 (1-4)：" })).trim();
  return choice;
}

async function main() {
  try {
    while (true) {
      const choice = await showMenu();

      if (choice === "1") {
        console.log();
        const spin = spinner("初始化中...").start();
        await initTaiwanPlacesCollection();
        spin.stop();
        console.log("✅ 知識庫初始化完成！\n");
      } else if (choice === "2") {
        console.log();
        while (true) {
          const query = (
            await input({
              message: "請輸入搜尋問題 (輸入 exit 返回主菜單)：",
            })
          ).trim();

          if (query === "") continue;
          if (query.toLowerCase() === "exit") {
            break;
          }

          const spin = spinner("搜尋中...").start();
          const results = await searchTaiwanPlaces(query, 5);
          spin.stop();

          console.log(`\n✨ 找到 ${results.length} 個相關結果：\n`);
          for (const [i, r] of results.entries()) {
            const relevanceBar =
              "█".repeat(Math.floor(r.score * 10)) +
              "░".repeat(10 - Math.floor(r.score * 10));
            console.log(
              `${i + 1}. 【${r.name}】 ${(r.score * 100).toFixed(1)}% [${relevanceBar}]`
            );
            console.log(`   ${r.content.substring(0, 100)}...\n`);
          }
        }
        console.log();
      } else if (choice === "3") {
        console.log("\n📍 台灣景點知識庫內容：\n");
        for (const [i, place] of taiwanPlacesData.entries()) {
          console.log(`${i + 1}. 【${place.name}】`);
          console.log(`   ${place.content}\n`);
        }
      } else if (choice === "4") {
        console.log("\n再會~👋\n");
        process.exit(0);
      } else {
        console.log("\n❌ 請輸入有效選項 (1-4)\n");
      }
    }
  } catch (err) {
    if (err.name === "ExitPromptError") {
      console.log("\n再會~👋");
      process.exit(0);
    } else {
      console.error("\n❌ 發生錯誤:", err.message);
      process.exit(1);
    }
  }
}

await main();
