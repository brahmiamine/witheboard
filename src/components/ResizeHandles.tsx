import React from "react";
import type { ResizeHandle } from "../types";

interface ResizeHandlesProps {
  isSelected: boolean;
  onResizeStart: (handle: ResizeHandle) => void;
}

const resizeHandles: ResizeHandle[] = [
  { position: "top-left", cursor: "nw-resize" },
  { position: "top", cursor: "n-resize" },
  { position: "top-right", cursor: "ne-resize" },
  { position: "right", cursor: "e-resize" },
  { position: "bottom-right", cursor: "se-resize" },
  { position: "bottom", cursor: "s-resize" },
  { position: "bottom-left", cursor: "sw-resize" },
  { position: "left", cursor: "w-resize" },
];

export function ResizeHandles({ isSelected, onResizeStart }: ResizeHandlesProps) {
  if (!isSelected) return null;

  const handleMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    onResizeStart(handle);
  };

  return (
    <>
      {resizeHandles.map((handle) => (
        <div
          key={handle.position}
          className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full z-50"
          style={{
            cursor: handle.cursor,
            left: handle.position.includes("left") ? "-6px" : handle.position.includes("right") ? "calc(100% - 6px)" : "50%",
            top: handle.position.includes("top") ? "-6px" : handle.position.includes("bottom") ? "calc(100% - 6px)" : "50%",
            transform:
              handle.position.includes("left") || handle.position.includes("right")
                ? "translateY(-50%)"
                : handle.position.includes("top") || handle.position.includes("bottom")
                ? "translateX(-50%)"
                : "translate(-50%, -50%)",
          }}
          onMouseDown={(e) => handleMouseDown(e, handle)}
        />
      ))}
    </>
  );
}
