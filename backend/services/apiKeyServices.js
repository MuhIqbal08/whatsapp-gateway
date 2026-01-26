import { generateApiKey } from "../utils/apiKey";

const apiKey = generateApiKey();

const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");

// tambah ke database

const key = await ApiKeys.create({
    name: "API Key",
    apiKeyHash: hashedKey,
    dailyLimit: 100,
    usedToday: 0,
    lastResetDate: new Date().toISOString().slice(0, 10)
});

