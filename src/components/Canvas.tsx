import React from "react";
import { useWhiteboard } from "../context/WhiteboardContext";
import { DraggableItem } from "./DraggableItem";
import { StylePanel } from "./StylePanel";
import { ZoomControls } from "./ZoomControls";

export function Canvas() {
  const { state, selectItem, pasteItem, undo, redo } = useWhiteboard();
  const [showStylePanel, setShowStylePanel] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Désélectionner si on clique sur le canvas vide
    if (e.target === e.currentTarget) {
      selectItem(null);
      setShowStylePanel(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      selectItem(null);
      setShowStylePanel(false);
    } else if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "z":
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case "y":
          e.preventDefault();
          redo();
          break;
        case "v":
          e.preventDefault();
          const position = {
            x: window.innerWidth / 2 - 75,
            y: window.innerHeight / 2 - 50,
          };
          pasteItem(position);
          break;
      }
    }
  };

  // Afficher le panneau de style quand un élément est sélectionné
  React.useEffect(() => {
    setShowStylePanel(!!state.selectedItem);
  }, [state.selectedItem]);

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden cursor-default">
      {/* Container du canvas avec zoom */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Grille de fond */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Zone de travail du canvas */}
        <div className="absolute inset-0 canvas-container" onClick={handleCanvasClick} onKeyDown={handleKeyDown} tabIndex={0}>
          {/* Éléments du whiteboard */}
          {state.items.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Indicateurs de mode */}
      {(state.isDragging || state.isResizing) && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium z-50">
          {state.isDragging ? "Déplacement en cours..." : "Redimensionnement en cours..."}
        </div>
      )}

      {/* Instructions */}
      {state.items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-2">Bienvenue sur votre Whiteboard Avancé</h2>
            <p className="text-lg mb-4">Utilisez la barre d'outils à gauche pour commencer</p>
            <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto">
              <div className="space-y-2">
                <h3 className="font-semibold">Formes</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded"></span>
                    <span>Post-it</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-400 rounded"></span>
                    <span>Rectangle</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
                    <span>Cercle</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-400 transform rotate-45"></span>
                    <span>Triangle</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Actions</h3>
                <div className="space-y-1 text-xs">
                  <div>• Glisser-déposer</div>
                  <div>• Double-clic pour éditer</div>
                  <div>• Ctrl+Z pour annuler</div>
                  <div>• Supprimer pour effacer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panneau de style */}
      <StylePanel isVisible={showStylePanel} />

      {/* Contrôles de zoom */}
      <ZoomControls zoom={zoom} setZoom={setZoom} />
    </div>
  );
}
