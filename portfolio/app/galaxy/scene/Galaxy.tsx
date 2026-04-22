"use client";

import { systems } from "../content";
import { systemPositions } from "../lib/systems";

export default function Galaxy() {
  return (
    <group>
      {systems.map(s => {
        const [x, y, z] = systemPositions[s.id];
        return (
          <mesh key={s.id} position={[x, y, z]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color={s.accentHex} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}
