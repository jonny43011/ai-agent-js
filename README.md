作業 2：新增⼀個 Function Calling ⼯具

@jonny43011 ➜ /workspaces/ai-agent-js (2.3-tool-calling-3) $ node function_call.js 
30°C = 86°F。

計算：30 × 9/5 + 32 = 86（華氏度）。
@jonny43011 ➜ /workspaces/ai-agent-js (2.3-tool-calling-3) $ node function_call.js 

[呼叫 tool] convert_unit({"value":100,"from_unit":"mile","to_unit":"km"})
100 英里約等於 160.93 公里。  
精確換算：100 × 1 英里(=1.609344 公里) = 160.9344 公里。需要四捨五入到整數或其他位數嗎？
@jonny43011 ➜ /workspaces/ai-agent-js (2.3-tool-calling-3) $ 20磅是幾公斤?
bash: 20磅是幾公斤?: command not found
@jonny43011 ➜ /workspaces/ai-agent-js (2.3-tool-calling-3) $ node function_call.js 

[呼叫 tool] convert_unit({"value":20,"from_unit":"lb","to_unit":"kg"})
20 磅 ≈ 9.07 公斤。  
（精確值約 9.0719 kg，因為 1 lb = 0.45359237 kg）
@jonny43011 ➜ /workspaces/ai-agent-js (2.3-tool-calling-3) $ node function_call.js 
攝氏 30 度等於華氏 86 度。

計算方式：F = C × 9/5 + 32 → 30 × 9/5 + 32 = 86。
@jonny43011 ➜ /workspaces/ai-agent-js (2.3-tool-calling-3) $ node function_call.js 

[呼叫 tool] convert_unit({"value":30,"from_unit":"C","to_unit":"F"})

[呼叫 tool] convert_unit({"value":100,"from_unit":"mile","to_unit":"km"})

[呼叫 tool] convert_unit({"value":20,"from_unit":"lb","to_unit":"kg"})
攝氏 30°C = 華氏 86°F。

100 英里 = 160.93445 公里（約 160.93 km）。

20 磅 = 9.071858 公斤（約 9.07 kg）。

（公式：F = C×9/5+32；1 mile = 1.609344 km；1 lb = 0.45359237 kg）
@jonny43011 ➜ /workspaces/ai-agent-js (2.3-tool-calling-3) $ 