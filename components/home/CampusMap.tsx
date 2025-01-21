export default function CampusMap({
  mapData,
  mapSize,
}: {
  mapData: {
    x: number;
    y: number;
    w: number;
    h: number;
    name: string;
    className?: string;
  }[];
  mapSize: number;
}) {
  const sizeX = Math.max(
    ...mapData.map((mapDataElement) => mapDataElement.x + mapDataElement.w)
  );
  const sizeY = Math.max(
    ...mapData.map((mapDataElement) => mapDataElement.y + mapDataElement.h)
  );
  const grid = Math.floor(mapSize / Math.max(sizeX, sizeY));

  return (
    <div
      className="block relative"
      style={{
        width: `${grid * sizeX}px`,
        height: `${grid * sizeY}px`,
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
            left: `${mapDataElement.x * grid + 4}px`,
            top: `${mapDataElement.y * grid + 4}px`,
            width: `${mapDataElement.w * grid - 8}px`,
            height: `${mapDataElement.h * grid - 8}px`,
          }}
        >
          {mapDataElement.name}
        </div>
      ))}
    </div>
  );
}
