export default async function handler(req, res) {
  try {
    // ===== PROJECT CONFIG =====
    const PROJECT = {
      name: "darzz-rc",
      owner: "Waris",
      apiKey: "DARZ",
      developer: "@DARWARIS",
      telegram: "@darzinfo",
      targetApi: "https://tobi-rc-api.vercel.app/"
    };

    // ===== READ PARAMS (GET / POST) =====
    const api = req.query.api || req.body?.api;
    const rcInput = req.query.rc || req.body?.rc;

    // ===== AUTH VALIDATION =====
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

    // ===== RC NORMALIZATION =====
    // remove spaces, hyphens, special chars; uppercase
    const rcNormalized = String(rcInput)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

    // ===== CALL TARGET API (BUILT-IN FETCH) =====
    const response = await fetch(
      `${PROJECT.targetApi}?rc_number=${encodeURIComponent(rcNormalized)}`,
      {
        method: "GET",
        headers: {
          "accept": "*/*",
          "user-agent": "DARZ-RC-Proxy"
        }
      }
    );

    const rawText = await response.text();

    // ===== SAFE JSON PARSE =====
    let leak;
    try {
      leak = JSON.parse(rawText);
    } catch {
      leak = rawText;
    }

    // ===== FINAL ORDERED RESPONSE =====
    return res.status(200).json({
      status: "success",
      api: PROJECT.apiKey,
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
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message
    });
  }
}
