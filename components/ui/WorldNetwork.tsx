import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land from "world-atlas/land-110m.json";
import { LAT_BOTTOM, LAT_TOP, MAP_H, MAP_W, project } from "@/lib/geo";

/* Server component: builds the gold "constellation" world map once and outputs static SVG.
   No JavaScript is sent to the browser for this graphic. */

type Ring = number[][];
type Poly = { rings: Ring[]; minX: number; maxX: number; minY: number; maxY: number };

const STEP = 4; //            grid spacing in degrees (smaller = denser map)
const JITTER = 0.7; //        how irregular the points are (0–1)
const MAX_LINKS = 3; //       connections per point
const LINK_RANGE = 1.9; //    max link length, in grid steps
const NODE_SHARE = 0.12; //   share of points drawn as larger "nodes"

/** Deterministic random numbers, so the map looks identical on every build. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function loadPolygons(): Poly[] {
  const topo = land as unknown as Topology;
  const fc = feature(topo, topo.objects.land as GeometryCollection) as unknown as {
    features: { geometry: { type: string; coordinates: unknown } | null }[];
  };

  const polys: Poly[] = [];
  for (const f of fc.features) {
    const g = f.geometry;
    if (!g) continue;
    const list =
      g.type === "Polygon" ? [g.coordinates as Ring[]] : g.type === "MultiPolygon" ? (g.coordinates as Ring[][]) : [];
    for (const rings of list) {
      const outer = rings[0];
      if (!outer || outer.length < 3) continue;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const [x, y] of outer) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      polys.push({ rings, minX, maxX, minY, maxY });
    }
  }
  return polys;
}

const POLYS = loadPolygons();

function inRing(x: number, y: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function onLand(lon: number, lat: number) {
  for (const p of POLYS) {
    if (lon < p.minX || lon > p.maxX || lat < p.minY || lat > p.maxY) continue;
    if (!inRing(lon, lat, p.rings[0])) continue;
    let inHole = false;
    for (let h = 1; h < p.rings.length; h++) {
      if (inRing(lon, lat, p.rings[h])) {
        inHole = true;
        break;
      }
    }
    if (!inHole) return true;
  }
  return false;
}

const f1 = (n: number) => n.toFixed(1);
const circle = (x: number, y: number, r: number) =>
  `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

function build() {
  const rand = seeded(20261027);
  const pts: { x: number; y: number; node: boolean }[] = [];

  for (let lat = LAT_TOP - STEP / 2; lat > LAT_BOTTOM; lat -= STEP) {
    for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) {
      const jl = lon + (rand() - 0.5) * STEP * JITTER;
      const jt = lat + (rand() - 0.5) * STEP * JITTER;
      const node = rand() < NODE_SHARE;
      let at: [number, number] | null = null;
      if (onLand(jl, jt)) at = [jl, jt];
      else if (onLand(lon, lat)) at = [lon, lat];
      if (!at) continue;
      const { x, y } = project(at[0], at[1]);
      pts.push({ x, y, node });
    }
  }

  // Connect each point to its nearest neighbours
  const maxD = STEP * LINK_RANGE * (MAP_W / 360);
  const maxD2 = maxD * maxD;
  const seen = new Set<number>();
  let links = "";
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const near: { j: number; d: number }[] = [];
    for (let j = 0; j < pts.length; j++) {
      if (j === i) continue;
      const dx = pts[j].x - a.x;
      const dy = pts[j].y - a.y;
      const d = dx * dx + dy * dy;
      if (d < maxD2) near.push({ j, d });
    }
    near.sort((p, q) => p.d - q.d);
    for (const { j } of near.slice(0, MAX_LINKS)) {
      const key = i < j ? i * 100000 + j : j * 100000 + i;
      if (seen.has(key)) continue;
      seen.add(key);
      const b = pts[j];
      links += `M${f1(a.x)} ${f1(a.y)}L${f1(b.x)} ${f1(b.y)}`;
    }
  }

  let dots = "";
  let nodes = "";
  let halos = "";
  for (const p of pts) {
    if (p.node) {
      nodes += circle(p.x, p.y, 2.6);
      halos += circle(p.x, p.y, 5.5);
    } else {
      dots += circle(p.x, p.y, 1.5);
    }
  }
  return { links, dots, nodes, halos };
}

const NET = build();

export default function WorldNetwork() {
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <path d={NET.links} fill="none" stroke="#D4AF37" strokeOpacity={0.24} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
      <path d={NET.halos} fill="#D4AF37" fillOpacity={0.1} />
      <path d={NET.dots} fill="#D4AF37" fillOpacity={0.7} />
      <path d={NET.nodes} fill="#E6C25A" />
    </svg>
  );
}