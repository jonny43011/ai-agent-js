import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { getWeatherTool, getWeather } from "./tools/weather.js";
import {
  getNearbyYoubikeTool,
  getNearbyYoubike,
} from "./tools/youbike.js";
import { getConvertUnitTool, convertUnit } from "./tools/convert_unit.js";
import { spinner } from "./utils/spinner.js";

const AVAILABLE_TOOLS = {
  get_weather: getWeather,
  get_nearby_youbike: getNearbyYoubike,
  convert_unit: convertUnit,
};

const tools = [getWeatherTool, getNearbyYoubikeTool, getConvertUnitTool];

const messages = [
  {
    role: "user",
    content:
      "攝氏30度是華氏幾度?  100英里是幾公里?  20磅是幾公斤?  30公分是幾公斤?",
  },
];

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
    console.log(message.content);
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
