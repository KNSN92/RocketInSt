"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function CampusMap({
  mapData,
  className,
}: {
  mapData: {
    x: number;
    y: number;
    w: number;
    h: number;
    name: ReactNode;
    className?: HTMLDivElement["className"];
  }[];
  className: HTMLDivElement["className"];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ tile: 0, x: 0, y: 0 });

  useEffect(() => {
    const resize = () => {
      const gridSizeX = Math.max(
        ...mapData.map((mapDataElement) => mapDataElement.x + mapDataElement.w),
      );
      const gridSizeY = Math.max(
        ...mapData.map((mapDataElement) => mapDataElement.y + mapDataElement.h),
      );
      if (!(gridSizeX && gridSizeY)) return;
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;
      const tileSize = Math.floor(
        Math.max(width, height) / Math.max(gridSizeX, gridSizeY),
      );
      setGrid({ tile: tileSize, x: gridSizeX, y: gridSizeY });
    };
    resize();
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, []);

  const gridGap = Math.ceil(grid.tile/40);

  return (
    <div className={className} ref={containerRef}>
      <div
        className="relative block"
        style={{
          width: `${grid.tile * grid.x}px`,
          height: `${grid.tile * grid.y}px`,
        }}
      >
        {mapData.map((mapDataElement, i) => (
          <div
            key={i}
            className={mapDataElement.className}
            style={{
              position: "absolute",
              padding: "0px",
              margin: "0px",
              left: `${mapDataElement.x * grid.tile + gridGap}px`,
              top: `${mapDataElement.y * grid.tile + gridGap}px`,
              width: `${mapDataElement.w * grid.tile - gridGap*2}px`,
              height: `${mapDataElement.h * grid.tile - gridGap*2}px`,
            }}
          >
            {mapDataElement.name}
          </div>
        ))}
      </div>
    </div>
  );
}
