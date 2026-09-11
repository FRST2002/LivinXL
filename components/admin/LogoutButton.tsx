"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    // Intentional full reload (not router.push): forces middleware to see the
    // cleared session cookie rather than relying on client-side route caching.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/admin/login";
  }

  return (
    <button type="button" onClick={handleLogout} className="btn-ghost">
      Uitloggen
    </button>
  );
}
