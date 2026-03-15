export const prerender = false;

import type { APIRoute } from "astro";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

const BUCKET = "playbook";
const FILE_PATH = "Ship-Your-AI-Agent-SyncLabs.pdf";

export const GET: APIRoute = async ({ url, redirect }) => {
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return redirect("/playbook?error=missing_session");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return redirect("/playbook?error=unpaid");
    }

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(FILE_PATH, 3600, {
        download: "Ship-Your-AI-Agent-SyncLabs.pdf",
      });

    if (error || !data?.signedUrl) {
      return redirect("/playbook?error=download_failed");
    }

    return redirect(data.signedUrl);
  } catch {
    return redirect("/playbook?error=invalid_session");
  }
};
