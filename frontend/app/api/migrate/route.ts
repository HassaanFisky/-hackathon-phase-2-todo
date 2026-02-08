import { getMigrations } from "better-auth/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(
      auth.options,
    );

    if (toBeCreated.length === 0 && toBeAdded.length === 0) {
      return Response.json({
        success: true,
        message: "Database is already up to date. No migrations needed.",
      });
    }

    await runMigrations();

    return Response.json({
      success: true,
      message: "Migration completed successfully!",
      tablesCreated: toBeCreated.map((t) => t.table),
      fieldsAdded: toBeAdded.map((t) => t.table),
    });
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
