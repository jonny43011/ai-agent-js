import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

const YOUBIKE_API =
  "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";

function normalizeArea(area) {
  return area?.toString().trim().replace(/\s+/g, "").toLowerCase();
}

async function getDistrictYoubike({
  area,
  available_amount = 0,
  limit = 10,
}) {
  const res = await fetch(YOUBIKE_API);
  const data = await res.json();

  const queryArea = normalizeArea(area);

  const stations = data
    .filter((s) => s.act === "1")
    .map((s) => ({
      name: s.sna.replace(/^YouBike2\.0_/, ""),
      district: s.sarea,
      address: s.ar,
      available_rent: Number(s.available_rent_bikes),
      available_return: Number(s.available_return_bikes),
      total: Number(s.Quantity),
    }))
    .filter(
      (s) =>
        normalizeArea(s.district).includes(queryArea) &&
        s.available_rent >= available_amount,
    )
    .sort((a, b) => b.available_rent - a.available_rent)
    .slice(0, limit);

  return {
    query: area,
    stations,
  };
}

export const youbikeTool = defineTool({
  name: "get_youbike_by_district",
  description:
    "透過台北市行政區名稱查詢可租借的 YouBike 站點。",
  fn: getDistrictYoubike,
  parameters: z.object({
    area: z.string().describe("台北市行政區名稱，例如 大安區 或 信義區"),
    available_amount: z
      .number()
      .default(0)
      .describe("至少可租借車輛數，預設 0"),
    limit: z.number().default(10).describe("回傳筆數上限，預設 10"),
  }),
});
