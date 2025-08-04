import { useState, useRef, useEffect, useCallback } from "react";
import type { WhiteboardItem, ResizeHandle, Size } from "../types";
import { useWhiteboard } from "../context/WhiteboardContext";
import { ResizeHandles } from "./ResizeHandles";

interface DraggableItemProps {
  item: WhiteboardItem;
}

export function DraggableItem({ item }: DraggableItemProps) {
  const { selectItem, updateItemPosition, updateItemSize, deleteItem, updateItemContent, setDragging, setResizing, updateItemProperty } =
    useWhiteboard();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content || "");
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState<{ size: Size; position: { x: number; y: number } } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const dragStartTime = useRef<number>(0);

  // Fonction optimisée pour le déplacement
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !item.selected) return;

      if (item.type === "text" && isEditing) return;

      // Calcul de position optimisé avec requestAnimationFrame
      requestAnimationFrame(() => {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };

        updateItemPosition(item.id, newPosition);
      });
    },
    [isDragging, item.selected, item.type, isEditing, dragOffset.x, dragOffset.y, updateItemPosition, item.id]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Détecter si c'est un double-clic pour l'édition
    const now = Date.now();
    const timeSinceLastClick = now - dragStartTime.current;

    if (timeSinceLastClick < 300) {
      // Double-clic détecté - activer l'édition
      setIsEditing(true);
      setEditContent(item.content || "");
      return;
    }

    dragStartTime.current = now;

    // Clic simple - commencer le déplacement
    selectItem(item.id);
    setIsDragging(true);
    setDragging(true);

    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragging(false);
    setResizeStart(null);
  }, [setDragging]);

  const handleResizeStart = (handle: ResizeHandle) => {
    setResizeStart({
      size: { ...item.size },
      position: { ...item.position },
    });
    setResizing(true, handle);
  };

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizeStart || !item.selected) return;

      requestAnimationFrame(() => {
        const deltaX = e.clientX - (resizeStart.position.x + dragOffset.x);
        const deltaY = e.clientY - (resizeStart.position.y + dragOffset.y);

        let newWidth = resizeStart.size.width;
        let newHeight = resizeStart.size.height;

        // Calculer la nouvelle taille selon le handle
        if (item.type !== "text") {
          newWidth = Math.max(20, resizeStart.size.width + deltaX);
          newHeight = Math.max(20, resizeStart.size.height + deltaY);
        }

        updateItemSize(item.id, { width: newWidth, height: newHeight });
      });
    },
    [resizeStart, item.selected, item.type, dragOffset.x, dragOffset.y, updateItemSize, item.id]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(item.content || "");
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      updateItemContent(item.id, editContent);
    } else if (e.key === "Delete" && item.selected) {
      deleteItem(item.id);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(item.content || "");
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      updateItemContent(item.id, editContent);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditContent(item.content || "");
  };

  const handleClick = () => {
    // Si on clique sur un élément sans texte, ajouter la possibilité d'éditer
    if (!item.content && item.type !== "text" && item.type !== "post-it") {
      setIsEditing(true);
      setEditContent("");
    }
  };

  const bringToFront = () => {
    const maxZIndex = Math.max(item.zIndex || 1, 1);
    updateItemProperty(item.id, "zIndex", maxZIndex + 1);
  };

  const sendToBack = () => {
    updateItemProperty(item.id, "zIndex", 1);
  };

  // Optimisation des event listeners
  useEffect(() => {
    if (item.selected) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mousemove", handleResizeMove, { passive: true });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("keydown", handleKeyDown as any);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("keydown", handleKeyDown as any);
      };
    }
  }, [item.selected, handleMouseMove, handleResizeMove, handleMouseUp]);

  const getTextStyle = () => ({
    fontSize: item.fontSize || 16,
    fontFamily: item.fontFamily || "system-ui",
    fontWeight: item.fontWeight || "normal",
    fontStyle: item.fontStyle || "normal",
    textDecoration: item.textDecoration || "none",
    textAlign: (item.textAlign as any) || "center",
    color: item.color || "#000000",
  });

  const renderShape = () => {
    const style = {
      width: "100%",
      height: "100%",
      backgroundColor: item.backgroundColor,
      border: item.borderWidth ? `${item.borderWidth}px solid ${item.borderColor || "#000"}` : "none",
      borderRadius: item.type === "circle" ? "50%" : item.type === "triangle" ? "0" : "0",
      transform: item.rotation ? `rotate(${item.rotation}deg)` : "none",
      opacity: item.opacity || 1,
    };

    switch (item.type) {
      case "circle":
        return <div style={style} />;
      case "triangle":
        return (
          <div
            style={{
              ...style,
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderLeft: `${item.size.width / 2}px solid transparent`,
              borderRight: `${item.size.width / 2}px solid transparent`,
              borderBottom: `${item.size.height}px solid ${item.backgroundColor}`,
            }}
          />
        );
      case "arrow":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 20"
            style={{
              transform: item.rotation ? `rotate(${item.rotation}deg)` : "none",
              transformOrigin: "center center",
            }}
          >
            <defs>
              <marker id={`arrowhead-${item.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={item.color || "#000"} />
              </marker>
            </defs>
            <line x1="10" y1="10" x2="90" y2="10" stroke={item.color || "#000"} strokeWidth="2" markerEnd={`url(#arrowhead-${item.id})`} />
          </svg>
        );
      case "line":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 20"
            style={{
              transform: item.rotation ? `rotate(${item.rotation}deg)` : "none",
              transformOrigin: "center center",
            }}
          >
            <line x1="10" y1="10" x2="90" y2="10" stroke={item.color || "#000"} strokeWidth="2" />
          </svg>
        );
      default:
        return <div style={style} />;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case "post-it":
        return (
          <div className="w-full h-full p-3 text-sm font-medium text-gray-800 break-words">
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={() => {
                  setIsEditing(false);
                  updateItemContent(item.id, editContent);
                }}
                className="w-full h-full resize-none bg-transparent border-none outline-none text-gray-800"
                autoFocus
              />
            ) : (
              <div onDoubleClick={() => setIsEditing(true)}>{item.content || "Double-cliquez pour éditer"}</div>
            )}
          </div>
        );

      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center">
            {isEditing ? (
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={() => {
                  setIsEditing(false);
                  updateItemContent(item.id, editContent);
                }}
                className="w-full h-full bg-transparent border-none outline-none text-center"
                style={getTextStyle()}
                autoFocus
              />
            ) : (
              <div onDoubleClick={() => setIsEditing(true)} style={getTextStyle()}>
                {item.content || "Double-cliquez pour éditer"}
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
            <img
              src={item.imageUrl}
              alt={item.imageAlt || "Image"}
              className="max-w-full max-h-full object-contain"
              style={{
                transform: item.rotation ? `rotate(${item.rotation}deg)` : "none",
              }}
            />
            {/* Texte permanent sur les images */}
            {item.content && !isEditing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="text-center break-words px-2 py-1 bg-white bg-opacity-80 rounded"
                  style={{
                    ...getTextStyle(),
                    maxWidth: "90%",
                    maxHeight: "90%",
                    overflow: "hidden",
                  }}
                >
                  {item.content}
                </div>
              </div>
            )}
            {/* Overlay pour l'édition de texte sur les images */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onBlur={() => {
                    setIsEditing(false);
                    updateItemContent(item.id, editContent);
                  }}
                  className="w-full h-full bg-transparent border-none outline-none text-center"
                  style={getTextStyle()}
                  autoFocus
                  placeholder="Tapez votre texte..."
                />
              </div>
            )}
            {/* Indicateur d'édition pour les images sans texte */}
            {!item.content && !isEditing && isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Cliquez pour ajouter du texte</span>
              </div>
            )}
          </div>
        );

      case "rectangle":
      case "circle":
      case "triangle":
      case "arrow":
      case "line":
        return (
          <div className="w-full h-full relative">
            {renderShape()}
            {/* Texte permanent sur les formes */}
            {item.content && !isEditing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="text-center break-words px-2 py-1"
                  style={{
                    ...getTextStyle(),
                    textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    overflow: "hidden",
                  }}
                >
                  {item.content}
                </div>
              </div>
            )}
            {/* Overlay pour l'édition de texte sur les formes */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onBlur={() => {
                    setIsEditing(false);
                    updateItemContent(item.id, editContent);
                  }}
                  className="w-full h-full bg-transparent border-none outline-none text-center"
                  style={getTextStyle()}
                  autoFocus
                  placeholder="Tapez votre texte..."
                />
              </div>
            )}
            {/* Indicateur d'édition pour les formes sans texte */}
            {!item.content && !isEditing && isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Cliquez pour ajouter du texte</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={itemRef}
      className={`
        absolute select-none transition-all duration-150 ease-out
        ${item.selected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
        hover:shadow-lg transform hover:scale-105
        ${isDragging ? "z-50" : ""}
      `}
      style={{
        left: item.position.x,
        top: item.position.y,
        width: item.size.width,
        height: item.size.height,
        zIndex: item.selected ? 10 : item.zIndex || 1,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        cursor: item.type === "text" ? "text" : isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {renderContent()}

      {item.selected && (
        <>
          <button
            onClick={() => deleteItem(item.id)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
          >
            ×
          </button>
          <button
            onClick={bringToFront}
            className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition-colors"
            title="Mettre au premier plan"
          >
            ↑
          </button>
          <button
            onClick={sendToBack}
            className="absolute -top-2 -left-8 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-600 transition-colors"
            title="Mettre à l'arrière-plan"
          >
            ↓
          </button>
          <ResizeHandles isSelected={item.selected} onResizeStart={handleResizeStart} />
        </>
      )}
    </div>
  );
}
