export const getConvertUnitTool = {
  type: "function",
  function: {
    name: "convert_unit",
    description: "進行單位換算",
    parameters: {
      type: "object",
      properties: {
        value: { type: "number", description: "數值，例如 25" },
        from_unit: { type: "string", description: "原始單位，例如 C, F, km, mile, kg, lb" },
        to_unit: { type: "string", description: "目標單位" },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
};

function normalizeUnit(u) {
  if (!u || typeof u !== "string") return "";
  return u.trim().toLowerCase();
}

function roundNumber(n) {
  return Math.round(n * 1000000) / 1000000;
}

export async function convertUnit({ value, from_unit, to_unit }) {
  const f = normalizeUnit(from_unit);
  const t = normalizeUnit(to_unit);

  // Temperature: Celsius <-> Fahrenheit
  const isC = (u) => ["c", "°c", "celsius", "攝氏"].includes(u);
  const isF = (u) => ["f", "°f", "fahrenheit", "華氏"].includes(u);

  if (isC(f) && isF(t)) {
    const res = value * 9 / 5 + 32;
    return { value: roundNumber(res), unit: to_unit };
  }
  if (isF(f) && isC(t)) {
    const res = (value - 32) * 5 / 9;
    return { value: roundNumber(res), unit: to_unit };
  }

  // Distance: km <-> mile
  const isKm = (u) => ["km", "kilometer", "kilometre", "kilometers", "公里"].includes(u);
  const isMile = (u) => ["mile", "miles", "mi", "英里"].includes(u);

  if (isKm(f) && isMile(t)) {
    const res = value * 0.621371;
    return { value: roundNumber(res), unit: to_unit };
  }
  if (isMile(f) && isKm(t)) {
    const res = value / 0.621371;
    return { value: roundNumber(res), unit: to_unit };
  }

  // Mass: kg <-> lb
  const isKg = (u) => ["kg", "kilogram", "kilograms", "公斤"].includes(u);
  const isLb = (u) => ["lb", "lbs", "pound", "pounds", "磅"].includes(u);

  if (isKg(f) && isLb(t)) {
    const res = value * 2.20462;
    return { value: roundNumber(res), unit: to_unit };
  }
  if (isLb(f) && isKg(t)) {
    const res = value / 2.20462;
    return { value: roundNumber(res), unit: to_unit };
  }

  return { error: `不支援的單位換算：${from_unit} -> ${to_unit}` };
}
