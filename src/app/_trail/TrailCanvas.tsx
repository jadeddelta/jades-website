import { dotMaskUrl } from './geometry/dotMask';
import { JADE, NEON } from './theme';
import type { NeonLevel } from './theme';
import type { TileId, TrailGeometry } from './types';

import type { CSSProperties } from 'react';

export interface TrailCanvasProps {
  geometry: TrailGeometry
  neon: NeonLevel
  showDots: boolean
  dotOpacity: number
  dotSize: number
  dotSpacing: number
  /** called as each polygon mounts and unmounts, so the painter can find nodes */
  registerTile: (id: TileId, el: SVGPolygonElement | null) => void
}

/** three-stacked full-document layers in painting order: dot field, vignette, mesh! */
export default function TrailCanvas({
  geometry,
  neon,
  showDots,
  dotOpacity,
  dotSize,
  dotSpacing,
  registerTile,
}: TrailCanvasProps) {
  const { tiles, width, height, ribbon } = geometry;
  const multiplier = NEON[neon];

  const dotStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      `radial-gradient(rgba(53,230,164,${dotOpacity}) ${dotSize}px, rgba(53,230,164,0) ${dotSize + 0.5}px)`,
    backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
  };

  if (ribbon && width && height) {
    const url = dotMaskUrl(ribbon, width, height);
    Object.assign(dotStyle, {
      maskImage: url,
      WebkitMaskImage: url,
      maskSize: '100% 100%',
      WebkitMaskSize: '100% 100%',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
    });
  }

  return (
    <>
      {showDots && <div style={dotStyle} />}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 70% at 12% 0%, rgba(29,107,76,.35) 0%, rgba(5,9,8,0) 60%),' +
            'radial-gradient(90% 60% at 95% 40%, rgba(53,230,164,.10) 0%, rgba(5,9,8,0) 55%)',
        }}
      />
      {/* wait until rendered: otherwise it'll add a garbage mesh at the top */}
      {width > 0 && height > 0 && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${height}px`,
            overflow: 'visible',
          }}
        >
          <g>
            {tiles.map((tile) => (
              <polygon
                key={tile.id}
                ref={(el) => {
                  registerTile(tile.id, el);
                }}
                points={tile.points}
                fill="none"
                stroke={JADE}
                strokeWidth={1.3}
                opacity={Math.min(1, tile.opacity * multiplier)}
              />
            ))}
          </g>
        </svg>
      )}
    </>
  );
}
