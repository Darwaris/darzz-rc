export default async function handler(req, res) {
  try {
    // ===== CONFIG =====
    const PROJECT = {
      name: "darzz-rc",
      owner: "Waris",
      developer: "@DARWARIS",
      telegram: "@darzinfo",
      apiKey: process.env.api_key, // 👈 EXACT ENV NAME
      targetApi: "https://tobi-rc-api.vercel.app/"
    };

    // ===== READ PARAMS =====
    const api = req.query.api;
    const rcInput = req.query.rc;

    // ===== AUTH CHECK =====
    if (!PROJECT.apiKey) {
      return res.status(500).json({
        status: "error",
        message: "API key not configured on server"
      });
    }

    if (!api || api !== PROJECT.apiKey) {
      return res.status(401).json({
        status: "error",
        message: "Invalid API key"
      });
    }

    if (!rcInput) {
      return res.status(400).json({
        status: "error",
        message: "Missing rc parameter"
      });
    }

    // ===== NORMALIZE RC =====
    const rcNormalized = String(rcInput)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

    // ===== FETCH TARGET API =====
    const response = await fetch(
      `${PROJECT.targetApi}?rc_number=${encodeURIComponent(rcNormalized)}`
    );

    const rawText = await response.text();

    let leak;
    try {
      leak = JSON.parse(rawText);
    } catch {
      leak = rawText;
    }

    // ===== ORDERED RESPONSE =====
    const finalResponse = {
      status: "success",
      api: api,
      query: {
        rc_input: rcInput,
        rc_normalized: rcNormalized
      },
      leak: leak,
      developer: PROJECT.developer,
      telegram: PROJECT.telegram,
      service: {
        project: PROJECT.name,
        owner: PROJECT.owner,
        platform: "Vercel"
      },
      copyright: `© ${PROJECT.name} | Made by ${PROJECT.owner}`
    };

    return res.status(200).json(finalResponse);

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message
    });
  }
}
