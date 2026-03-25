import express from "express";
import clerkWebHooks from "../controllers/clerkWebhooks.js";

const router = express.Router();

router.post("/webhook", express.raw({ type: "application/json" }), clerkWebHooks);

export default router;