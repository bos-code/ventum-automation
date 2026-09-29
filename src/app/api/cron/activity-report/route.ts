import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  AppwriteCheckError,
  collectActivityStats,
  formatActivityReport,
  formatBackendAlert,
  isReportDay,
} from "@/lib/activity-report";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

/**
 * Callers (the GitHub Actions workflow, or a manual curl) must send
 * `Authorization: Bearer $CRON_SECRET`.
 */
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Called daily (.github/workflows/activity-report.yml); sends the activity report on every fifth
 * day of the cycle. `?force=1` sends it now regardless of the cycle.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const force = request.nextUrl.searchParams.get("force") === "1";
  if (!force && !isReportDay(now)) {
    console.log("[activity-report] not a report day; skipped");
    return Response.json({ status: "skipped", reason: "not a report day" });
  }

  try {
    const stats = await collectActivityStats(now);
    console.log("[activity-report] Appwrite queried OK:", JSON.stringify(stats));

    const telegram = await sendTelegramMessage(formatActivityReport(stats));
    if (!telegram.ok) {
      console.error("[activity-report] Telegram rejected report:", telegram.error);
      return Response.json(
        { status: "telegram_failed", appwrite: "ok", stats, telegram },
        { status: 502 }
      );
    }
    console.log(`[activity-report] Telegram accepted report, message_id=${telegram.messageId}`);
    return Response.json({
      status: "sent",
      appwrite: "ok",
      stats,
      telegram: { ok: true, messageId: telegram.messageId },
    });
  } catch (error) {
    if (!(error instanceof AppwriteCheckError)) throw error;

    console.error(
      `[activity-report] Appwrite ${error.step} failed (${error.kind}):`,
      error.cause
    );
    const telegram = await sendTelegramMessage(formatBackendAlert(error));
    if (telegram.ok) {
      console.log(`[activity-report] Telegram accepted backend alert, message_id=${telegram.messageId}`);
    } else {
      console.error("[activity-report] Telegram rejected backend alert:", telegram.error);
    }
    return Response.json(
      {
        status: "appwrite_failed",
        appwrite: { kind: error.kind, step: error.step },
        telegram: telegram.ok ? { ok: true, messageId: telegram.messageId } : telegram,
      },
      { status: 503 }
    );
  }
}
