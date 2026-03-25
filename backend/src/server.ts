import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Failed to connect to the database:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database at:", res.rows[0].now);
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const dbRes = await pool.query("SELECT current_database();");
    res.json({
      status: "healthy",
      database: dbRes.rows[0].current_database,
      message: "Dota 2 Draft API is running natively!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed" });
  }
});

app.get("/api/heroes", async (req, res) => {
  const ENDPOINT_KEY = "opendota_heroes";
  const CACHE_TTL_HOURS = 24;

  try {
    const cacheCheck = await pool.query(
      `SELECT response_data, updated_at 
       FROM api_cache 
       WHERE endpoint = $1`,
      [ENDPOINT_KEY],
    );

    if (cacheCheck.rows.length > 0) {
      const cacheRow = cacheCheck.rows[0];
      const hoursSinceUpdate =
        (Date.now() - new Date(cacheRow.updated_at).getTime()) /
        (1000 * 60 * 60);

      if (hoursSinceUpdate < CACHE_TTL_HOURS) {
        console.log("⚡ Serving heroes from PostgreSQL Cache");
        return res.json(cacheRow.response_data);
      }
    }

    console.log("🌐 Fetching fresh heroes from OpenDota API...");
    const opendotaRes = await fetch("https://api.opendota.com/api/heroes");

    if (!opendotaRes.ok) {
      throw new Error("Failed to fetch from OpenDota");
    }

    const heroesData = await opendotaRes.json();

    await pool.query(
      `INSERT INTO api_cache (endpoint, response_data, updated_at) 
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (endpoint) 
       DO UPDATE SET response_data = EXCLUDED.response_data, updated_at = CURRENT_TIMESTAMP`,
      [ENDPOINT_KEY, JSON.stringify(heroesData)],
    );

    console.log("💾 Saved fresh heroes to PostgreSQL Cache");
    res.json(heroesData);
  } catch (error) {
    console.error("Heroes API Error:", error);
    res.status(500).json({ error: "Failed to load heroes data" });
  }
});

app.get("/api/plans", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM draft_plans ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Failed to fetch draft plans" });
  }
});

app.post("/api/plans", async (req, res) => {
  const {
    id,
    name,
    desc,
    bans = [],
    picks = [],
    threats = [],
    timings = [],
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO draft_plans (id, name, description, bans, picks, threats, timings) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        id,
        name,
        desc,
        JSON.stringify(bans),
        JSON.stringify(picks),
        JSON.stringify(threats),
        JSON.stringify(timings),
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ error: "Failed to create draft plan" });
  }
});

app.put("/api/plans/:id", async (req, res) => {
  const { id } = req.params;
  const { name, desc, bans, picks, threats, timings } = req.body;

  try {
    const result = await pool.query(
      `UPDATE draft_plans 
       SET name = $1, description = $2, bans = $3, picks = $4, threats = $5, timings = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [
        name,
        desc,
        JSON.stringify(bans),
        JSON.stringify(picks),
        JSON.stringify(threats),
        JSON.stringify(timings),
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ error: "Failed to update draft plan" });
  }
});

app.delete("/api/plans/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM draft_plans WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({ error: "Failed to delete draft plan" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

export { pool };
