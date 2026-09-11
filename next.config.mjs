/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // A strict Content-Security-Policy is deliberately NOT included here: Next.js's
    // own hydration scripts need either 'unsafe-inline' or a per-request nonce to
    // work, and getting that wrong breaks every page's JavaScript site-wide. Add one
    // later with careful testing (nonce-based, via middleware) rather than guessing.
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
