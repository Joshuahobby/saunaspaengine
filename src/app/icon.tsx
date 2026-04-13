import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(145deg, #2d5a27 0%, #1e3d1b 100%)",
                    borderRadius: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {/* Steam wisps */}
                <div
                    style={{
                        position: "absolute",
                        top: "3px",
                        left: "7px",
                        width: "3px",
                        height: "7px",
                        borderRadius: "3px",
                        background: "rgba(251,191,36,0.5)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "2px",
                        left: "13px",
                        width: "3px",
                        height: "9px",
                        borderRadius: "3px",
                        background: "rgba(251,191,36,0.5)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "3px",
                        left: "19px",
                        width: "3px",
                        height: "7px",
                        borderRadius: "3px",
                        background: "rgba(251,191,36,0.5)",
                    }}
                />
                {/* Sauna bench */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "7px",
                        left: "5px",
                        right: "5px",
                        height: "4px",
                        borderRadius: "2px",
                        background: "#fbbf24",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "5px",
                        right: "5px",
                        height: "4px",
                        borderRadius: "2px",
                        background: "rgba(251,191,36,0.6)",
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
