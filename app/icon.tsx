import { ImageResponse } from "next/og";

// Structural placeholder favicon matching the header wordmark's "VG"
// mark (see components/site/logo.tsx). Replace with the real Ventum
// mark once public/brand/ventum-mark.(svg|png) is supplied — see
// docs/ASSET_GUIDE.md.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d4ed8",
          color: "#f8fafc",
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        VG
      </div>
    ),
    { ...size },
  );
}
