import { useEffect, useMemo, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Destination } from "~/content/universe";
import type { SceneEvents, Tier } from "../bus";
import { labelTexture, boardTexture } from "../textures";
import { Box, GlassBox, Panel, Plaza, type Mats } from "../kit";

/**
 * CareConnect, R2 bespoke world. Every element stands for something the case study documents;
 * nothing here depicts product behaviour, users or results.
 *  - Ghost structure (back, unlit, wireframe): the caregiver-marketplace brief rejected in decision D-01.
 *  - Family wing (left, taller): "the family's screen answers: is someone with my parent, is anything wrong…".
 *  - Attendant wing (right, a single storey): "the attendant's screen is the entire app".
 *  - Handover bridge between them: the handover pack — "nothing that survives the attendant leaving" was the gap.
 *  - The walkway behind: the 18 real screenshots (demo episode, fictional patient) grouped by caption,
 *    under one label for the beachhead: the first 30 days after discharge.
 */
export const CC_TARGET = new THREE.Vector3(0, 2.6, 0);
/** Arrival: down over the rejected brief, along the handover bridge, out to the walkway view. */
export const CC_ARRIVAL = [new THREE.Vector3(0, 30, -42), new THREE.Vector3(0, 9, -4)];

const GROUP_ORDER = ["setup", "family", "handover", "attendant"] as const; // left → right along the walkway

export function CareConnectScene({ d, m, tier, events }: { d: Destination; m: Mats; tier: Tier; events: MutableRefObject<SceneEvents> }) {
  const { scene, invalidate } = useThree();
  const accent = d.building.palette.accent;

  /* clinical dawn: cool blue-green haze, warm low sun */
  useEffect(() => {
    const bg = scene.background, fog = scene.fog;
    scene.background = new THREE.Color("#061113");
    scene.fog = new THREE.FogExp2("#071518", 0.017);
    invalidate();
    return () => { scene.background = bg; scene.fog = fog; };
  }, [scene, invalidate]);

  /* the walkway: stations in group order on an arc behind the wings (phones: the first of each group) */
  const groups = useMemo(() => GROUP_ORDER.map((k) => d.journey?.find((g) => g.key === k)).filter((g): g is NonNullable<typeof g> => !!g), [d]);
  const stations = useMemo(() => {
    const list = groups.flatMap((g) => (tier === "mobile" ? g.items.slice(0, 1) : g.items).map((i, n) => ({ i, group: g, first: n === 0 })));
    const spread = tier === "mobile" ? 1.9 : 2.9, r = tier === "mobile" ? 11.5 : 13.5, k = Math.max(1, list.length - 1);
    return list.map((s, n) => {
      const a = Math.PI + spread / 2 - (spread * n) / k;
      return { ...s, at: { pos: [Math.sin(a) * r, 0, Math.cos(a) * r] as [number, number, number], rotY: a + Math.PI, h: tier === "mobile" ? 2.3 : 2.1 } };
    });
  }, [groups, tier]);

  /* labels: group signs, the ghost's sign, wing and bridge signs, the walkway title */
  const signs = useMemo(() => ({
    ghost: boardTexture(["REJECTED BRIEF", "", "A caregiver marketplace:", "discover, evaluate, book and manage", "home caregivers", "", "Decision D-01 · gave up the larger, more obvious business"], "Not built · the research said discovery was not the problem", "#8FA39B"),
    family: labelTexture("Family wing", "Is someone with my parent? Is anything wrong?", accent),
    attendant: labelTexture("Attendant wing", "One screen is the entire app", accent),
    bridge: labelTexture("Handover bridge", "The record that stays with the patient", accent),
    walk: labelTexture("Walkway", "The first 30 days after discharge · demo episode", accent),
    groups: Object.fromEntries(groups.map((g) => [g.key, labelTexture(g.title.split(" · ")[0], g.title.split(" · ")[1] ?? "", accent)])),
  }), [groups, accent]);
  useEffect(() => () => { [signs.ghost, signs.family, signs.attendant, signs.bridge, signs.walk, ...Object.values(signs.groups)].forEach((t) => t.dispose()); }, [signs]);

  /* the rejected marketplace: storefront volumes drawn as faint outlines only */
  const ghost = useMemo(() => {
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: "#7A8C86", transparent: true, opacity: 0.32 });
    const boxes: [number, number, number, number, number][] = [[-7, 3.5, 5, 7, 4], [-1.5, 5, 5, 10, 4], [4, 3, 5, 6, 4], [8.5, 2.2, 4, 4.4, 4]];
    const geos: THREE.BufferGeometry[] = [];
    for (const [x, hh, w, h, dd] of boxes) {
      const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, dd)); geos.push(geo);
      const l = new THREE.LineSegments(geo, mat); l.position.set(x, hh, 0); g.add(l);
    }
    g.position.set(0, 0, -26);
    return { g, dispose: () => { geos.forEach((x) => x.dispose()); mat.dispose(); } };
  }, []);
  useEffect(() => () => ghost.dispose(), [ghost]);

  const sign = (map: THREE.Texture, w: number, h: number, p: [number, number, number], r = 0) => (
    <mesh position={p} rotation={[0, r, 0]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={map} transparent toneMapped={false} /></mesh>
  );

  return (
    <group>
      <hemisphereLight args={["#D7F3FF", "#0B1110", 0.5]} />
      <directionalLight position={[-14, 6, 10]} intensity={1.7} color="#FFD9B0" />
      <pointLight position={[-5.5, 3, 1]} intensity={14} distance={14} color="#FFB36B" />
      <pointLight position={[5.5, 2, 1]} intensity={12} distance={12} color={accent} />
      <Plaza accent={accent} />

      {/* rejected brief (D-01) */}
      <primitive object={ghost.g} />
      {sign(signs.ghost, 7.5, 4.2, [0, 12.8, -26])}

      {/* family wing: three storeys */}
      <GlassBox m={m} s={[5.6, 5.4, 3.6]} p={[-5.6, 2.7, 0]} />
      <Box s={[5.8, 0.12, 3.8]} p={[-5.6, 5.46, 0]} mat={m.body} />
      {sign(signs.family, 4.6, 0.62, [-5.6, 6.1, 1.9])}

      {/* attendant wing: one storey */}
      <GlassBox m={m} s={[4.4, 2.6, 3.6]} p={[5.6, 1.3, 0]} />
      <Box s={[4.6, 0.12, 3.8]} p={[5.6, 2.66, 0]} mat={m.body} />
      {sign(signs.attendant, 4.2, 0.57, [5.6, 3.25, 1.9])}

      {/* handover bridge: from the family wing to the attendant wing */}
      <GlassBox m={m} s={[5.0, 0.8, 1.5]} p={[0.5, 2.15, 0]} />
      <Box s={[5.1, 0.06, 1.6]} p={[0.5, 1.72, 0]} mat={m.light} />
      {sign(signs.bridge, 4.4, 0.6, [0.5, 3.0, 0.8])}

      {/* the walkway of real screenshots */}
      {tier !== "mobile" && sign(signs.walk, 5.2, 0.7, [0, 5.4, -tierRadius(tier) - 0.6])}
      {stations.map((s, n) => (
        <group key={s.i}>
          <Panel item={d.gallery[s.i]} index={s.i} count={stations.length} accent={accent} events={events} at={s.at} delay={1200 + n * 220} />
          {s.first && tier !== "mobile" && signs.groups[s.group.key] && (
            <mesh position={[s.at.pos[0], 1.45 + (s.at.h ?? 2.1) + 0.55, s.at.pos[2]]} rotation={[0, s.at.rotY, 0]}>
              <planeGeometry args={[3.4, 0.46]} /><meshBasicMaterial map={signs.groups[s.group.key]} transparent toneMapped={false} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
const tierRadius = (t: Tier) => (t === "mobile" ? 11.5 : 13.5);
