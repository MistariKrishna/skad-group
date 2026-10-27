import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SKAD GROUP — Building Businesses. Creating Brands. Shaping the Future.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0A1F44 0%, #07152F 100%)",
          color: "#FFFFFF",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -160, top: -160, width: 520, height: 520, borderRadius: 9999, border: "2px solid rgba(212,175,55,0.25)", display: "flex" }} />
        <div style={{ position: "absolute", right: -40, top: -40, width: 280, height: 280, borderRadius: 9999, border: "2px solid rgba(212,175,55,0.4)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, letterSpacing: 6, fontWeight: 700 }}>
          <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#D4AF37", display: "flex" }} />
          SKAD GROUP
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, lineHeight: 1.08, fontWeight: 700, letterSpacing: -1 }}>
          <span>Building businesses.</span>
          <span>Creating brands.</span>
          <span style={{ color: "#D4AF37" }}>Shaping the future.</span>
        </div>

        <div style={{ display: "flex", fontSize: 24, letterSpacing: 8, color: "rgba(255,255,255,0.7)" }}>BUILD • CONNECT • SCALE</div>
      </div>
    ),
    size,
  );
}