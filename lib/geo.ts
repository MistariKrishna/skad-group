/** Shared map projection (equirectangular), used by the server-drawn network and the client pins. */
export const MAP_W = 1000;
export const LAT_TOP = 84; //     crop above northern Greenland
export const LAT_BOTTOM = -58; // crop below Cape Horn (no Antarctica)
export const MAP_H = (MAP_W * (LAT_TOP - LAT_BOTTOM)) / 360;

export function project(lon: number, lat: number): { x: number; y: number } {
  return {
    x: ((lon + 180) / 360) * MAP_W,
    y: ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * MAP_H,
  };
}