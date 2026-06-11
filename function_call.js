import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { spinner } from "./utils/spinner.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const AVAILABLE_TOOLS = Object.fromEntries(toolList.map((t) => [t.name, t.fn]));

const messages = [
  {
    role: "system",
    content:
      "你是一個專門回答台北市現在時間和台北市行政區 YouBike 可借狀況的助理。"
      + " 當使用者問「現在幾點」或相關時間問題時，請呼叫 get_current_time 工具。"
      + " 當使用者問台北市行政區的 YouBike 借還狀況時，請呼叫 get_youbike_by_district 工具。"
      + " 只要執行時間查詢，請使用時間工具；只要查詢 YouBike 行政區可借情況，請使用 YouBike 工具。"
      + " 使用台北市行政區名稱如 大安區、信義區 等進行查詢，傳入「台北市」不會找到 YouBike 資料。"
      + " 請用繁體中文回答。",
  },
];

const rl = readline.createInterface({ input, output });

async function run() {
  console.log("YouBike 與時間工具助理已啟動。輸入 exit 離開。");

  while (true) {
    const userInput = (await rl.question("請輸入你的問題：")).trim();

    if (!userInput) continue;
    if (userInput.toLowerCase() === "exit") {
      console.log("再見！");
      rl.close();
      break;
    }

    messages.push({ role: "user", content: userInput });

    while (true) {
      const spin = spinner("思考中...").start();

      const response = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages,
        tools,
        tool_choice: "auto",
      });

      spin.stop();

      const message = response.choices[0].message;
      messages.push(message);

      if (!message.tool_calls || message.tool_calls.length === 0) {
        if (message.content) {
          console.log(message.content);
        }
        break;
      }

      for (const toolCall of message.tool_calls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        console.log(`\n[呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

        const fn = AVAILABLE_TOOLS[fnName];
        const result = await fn(args);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
