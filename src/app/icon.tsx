import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          borderRadius: 16,
          background: "linear-gradient(135deg, #8a6dff, #4f2fe0)",
          color: "#fff",
          fontSize: 44,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        l
      </div>
    ),
    size,
  );
}
