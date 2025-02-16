"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function RoomSearchSelector({
  rooms,
  className,
}: {
  rooms: string[];
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedRooms, setSelectedRooms] = useState<{
    [key: string]: boolean;
  }>(Object.fromEntries(rooms.map((room) => [room, false])));

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const selectedRoomParams = params.getAll("room");
    const newSelectedRooms = { ...selectedRooms };
    selectedRoomParams.forEach((selectedRoomParam) => {
      newSelectedRooms[selectedRoomParam] = true;
    });
    setSelectedRooms(newSelectedRooms);
  }, []);

  const handleSearchRooms = useDebouncedCallback(
    (pressedRooms: { [key: string]: boolean }) => {
      const params = new URLSearchParams(searchParams);
      params.delete("room");
      Object.entries(pressedRooms).map(([room, pressed]) => {
        if (pressed) params.append("room", room);
      });
      replace(`${pathname}?${params.toString()}`);
    },
    300,
  );

  useEffect(() => {}, []);

  return (
    <>
      {rooms.map((room, i) => (
        <button
          className={clsx(
            className,
            "w-fit rounded-lg border-1 px-2 py-1 text-white",
            selectedRooms[room]
              ? "border-blue-300 bg-blue-700"
              : "border-blue-400 bg-blue-500",
          )}
          value={room}
          onClick={() => {
            const newSelectedRooms = { ...selectedRooms };
            newSelectedRooms[room] = !newSelectedRooms[room];
            setSelectedRooms(newSelectedRooms);
            handleSearchRooms(newSelectedRooms);
          }}
          key={i}
        >
          {room}
        </button>
      ))}
    </>
  );
}
