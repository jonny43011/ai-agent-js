import { qdrant, embed, EMBEDDING_DIM } from "./qdrant.js";

export const TAIWAN_PLACES_COLLECTION = "taiwan_places";

// 台灣景點知識庫數據
export const taiwanPlacesData = [
  {
    id: 1,
    name: "阿里山",
    content:
      "阿里山位於嘉義縣，以日出、雲海、森林鐵路聞名。海拔2216公尺，三月櫻花盛開，吸引大量遊客。阿里山森林鐵路是世界罕見的登山鐵路，沿途可欣賞熱帶、亞熱帶、溫帶森林景觀。特色包括樹齡超過3000年的紅檜神木。",
  },
  {
    id: 2,
    name: "日月潭",
    content:
      "日月潭位於南投縣，是台灣最大的內陸淡水湖泊。湖光山色優美，環潭步道全長約33公里，適合健行和自行車旅遊。日月潭以日落和月出景觀著稱，是台灣八景之一。湖邊有文武廟、龍鳳宮等寺廟，融合自然與人文特色。",
  },
  {
    id: 3,
    name: "太魯閣",
    content:
      "太魯閣峽谷位於花蓮縣，以雄偉的大理石峽谷聞名於世。中央山脈由東西向切割而成的景象壯觀非凡。景區內有多條步道如錐麓古道、祖母綠步道，可近距離欣賞峽谷地貌。太魯閣國家公園擁有台灣最典型的地質教室和豐富的自然生態資源。",
  },
  {
    id: 4,
    name: "墾丁",
    content:
      "墾丁位於屏東縣，是台灣最南端的度假勝地。擁有優美的白沙灘、清澈的海水，是台灣最佳的水上運動中心。這裡全年氣候溫暖，適合衝浪、浮潛、滑翔傘等水上活動。夜晚的墾丁夜市人氣旺盛，是遊客必訪景點。",
  },
  {
    id: 5,
    name: "陽明山",
    content:
      "陽明山位於台北市，又名北投火山群。以溫泉、杜鵑花海聞名。陽明山國家公園擁有獨特的火山地形、溫泉景觀和豐富的生態資源。春季杜鵑花盛開，漫山遍野一片繽紛。山上設有多個觀景點，可俯瞰台北全景和北投風光。",
  },
];

// 初始化知識庫
export async function initTaiwanPlacesCollection() {
  try {
    // 檢查集合是否存在
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === TAIWAN_PLACES_COLLECTION
    );

    if (exists) {
      console.log("✓ 台灣景點集合已存在");
      return;
    }

    // 創建集合
    await qdrant.recreateCollection(TAIWAN_PLACES_COLLECTION, {
      vectors: {
        size: EMBEDDING_DIM,
        distance: "Cosine",
      },
    });

    console.log("✓ 已創建台灣景點集合");

    // 將知識內容加入向量資料庫
    console.log("正在生成 embeddings 並加入知識庫...");

    for (const place of taiwanPlacesData) {
      const vector = await embed(place.content);
      await qdrant.upsert(TAIWAN_PLACES_COLLECTION, {
        points: [
          {
            id: place.id,
            vector,
            payload: {
              name: place.name,
              content: place.content,
            },
          },
        ],
      });
      console.log(`✓ 已添加：${place.name}`);
    }

    console.log("✓ 知識庫初始化完成");
  } catch (err) {
    console.error("初始化失敗:", err.message);
    throw err;
  }
}

// 搜尋台灣景點
export async function searchTaiwanPlaces(query, limit = 5) {
  try {
    const vector = await embed(query);

    const results = await qdrant.search(TAIWAN_PLACES_COLLECTION, {
      vector,
      limit,
      with_payload: true,
    });

    return results.map((r) => ({
      score: r.score,
      name: r.payload.name,
      content: r.payload.content,
    }));
  } catch (err) {
    console.error("搜尋失敗:", err.message);
    throw err;
  }
}
