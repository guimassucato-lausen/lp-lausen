import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lausen — OTC Corporativo BRL/USDT";

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const pt = locale !== "en";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "radial-gradient(circle at 70% 30%, #6b46ff 0%, #13213c 45%, #0a0d12 80%)",
          color: "#e8f6ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -2 }}>lausen</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#a996ff", letterSpacing: 6, textTransform: "uppercase" }}>
            {pt ? "OTC Corporativo · BRL/USDT" : "Corporate OTC · BRL/USDT"}
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, marginTop: 20, maxWidth: 900 }}>
            {pt ? "Câmbio digital para empresas que movem volume." : "Digital FX for companies that move volume."}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#a8b5cc" }}>
          {pt ? "PSAV em processo de regulação · Res. BCB nº 520" : "VASP in regulatory process · BCB Res. No. 520"}
        </div>
      </div>
    ),
    size,
  );
}
