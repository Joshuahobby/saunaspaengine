import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(145deg, #2d5a27 0%, #1e3d1b 100%)",
                    borderRadius: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    position: "relative",
                }}
            >
                {/* Steam wisps */}
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "-4px" }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: "10px",
                                height: i === 1 ? "32px" : "24px",
                                borderRadius: "6px",
                                background: "rgba(251,191,36,0.55)",
                            }}
                        />
                    ))}
                </div>

                {/* Sauna benches */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "120px" }}>
                    <div
                        style={{
                            height: "14px",
                            borderRadius: "7px",
                            background: "rgba(251,191,36,0.6)",
                        }}
                    />
                    <div
                        style={{
                            height: "14px",
                            borderRadius: "7px",
                            background: "#fbbf24",
                        }}
                    />
                </div>

                {/* Brand label */}
                <div
                    style={{
                        fontSize: "26px",
                        fontWeight: "900",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "4px",
                        fontFamily: "sans-serif",
                        marginTop: "4px",
                    }}
                >
                    SPA
                </div>
            </div>
        ),
        { ...size }
    );
}
