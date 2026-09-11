import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasAdminUsername: Boolean(process.env.ADMIN_USERNAME),
    hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
    hasAdminSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
    usernameLength: process.env.ADMIN_USERNAME?.length ?? 0,
    passwordLength: process.env.ADMIN_PASSWORD?.length ?? 0,
  });
}
