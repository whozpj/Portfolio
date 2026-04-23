"use client";

import { Html } from "@react-three/drei";

interface Props {
  center: [number, number, number];
  bio?: string;
}

export default function IntroHalo({ center, bio }: Props) {
  return (
    <group position={center}>
      {/* Name + title floating above the star */}
      <Html
        center
        distanceFactor={18}
        position={[0, 3.2, 0]}
        style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", whiteSpace: "nowrap" }}
      >
        <div style={{ color: "rgba(255,255,255,0.95)", fontFamily: "ui-monospace, monospace", fontSize: "15px", letterSpacing: "0.45em", textTransform: "uppercase" }}>
          Prithvi Raj
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontFamily: "ui-monospace, monospace", fontSize: "8px", letterSpacing: "0.3em", marginTop: "8px", textTransform: "uppercase" }}>
          Software Engineer · Applied AI
        </div>
      </Html>

      {/* Ambient floating tags — scattered, non-interactive */}
      <Html center distanceFactor={18} position={[4.5, 1, 0]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.28)", fontFamily: "ui-monospace, monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          CS · UVA
        </div>
      </Html>

      <Html center distanceFactor={18} position={[-4.5, 0.5, 1]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.22)", fontFamily: "ui-monospace, monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          Open to Internships · 2026
        </div>
      </Html>

      <Html center distanceFactor={18} position={[3.5, -1.8, -1]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.2)", fontFamily: "ui-monospace, monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          ManTech · Candlefish
        </div>
      </Html>

      <Html center distanceFactor={18} position={[-3, -1.2, 1.5]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.18)", fontFamily: "ui-monospace, monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          Python · TypeScript · AI
        </div>
      </Html>

      {/* Bio text below star */}
      {bio ? (
        <Html
          center
          distanceFactor={18}
          position={[0, -3.8, 0]}
          style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", width: "290px" }}
        >
          <div style={{ color: "rgba(255,255,255,0.22)", fontFamily: "ui-monospace, monospace", fontSize: "7.5px", letterSpacing: "0.1em", lineHeight: "2", textTransform: "uppercase" }}>
            {bio}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
