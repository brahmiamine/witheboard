import { useRef, useState } from "react";
import { useWhiteboard } from "../context/WhiteboardContext";
import type { ElementType } from "../types";

export function Toolbar() {
  const { addItem, clearAll, state, undo, redo, copyItem, pasteItem, importImage } = useWhiteboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showStylePanel, setShowStylePanel] = useState(false);

  const handleAddItem = (type: ElementType) => {
    const position = {
      x: window.innerWidth / 2 - 75,
      y: window.innerHeight / 2 - 50,
    };
    addItem(type, position);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importImage(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopy = () => {
    if (state.selectedItem) {
      copyItem(state.selectedItem);
    }
  };

  const handlePaste = () => {
    const position = {
      x: window.innerWidth / 2 - 75,
      y: window.innerHeight / 2 - 50,
    };
    pasteItem(position);
  };

  const tools = [
    {
      type: "post-it" as const,
      label: "Post-it",
      icon: "📝",
      color: "bg-yellow-100 hover:bg-yellow-200",
    },
    {
      type: "rectangle" as const,
      label: "Rectangle",
      icon: "⬜",
      color: "bg-blue-100 hover:bg-blue-200",
    },
    {
      type: "circle" as const,
      label: "Cercle",
      icon: "⭕",
      color: "bg-pink-100 hover:bg-pink-200",
    },
    {
      type: "triangle" as const,
      label: "Triangle",
      icon: "🔺",
      color: "bg-green-100 hover:bg-green-200",
    },
    {
      type: "text" as const,
      label: "Texte",
      icon: "T",
      color: "bg-gray-100 hover:bg-gray-200",
    },
    {
      type: "arrow" as const,
      label: "Flèche",
      icon: "➡️",
      color: "bg-purple-100 hover:bg-purple-200",
    },
    {
      type: "line" as const,
      label: "Ligne",
      icon: "➖",
      color: "bg-orange-100 hover:bg-orange-200",
    },
  ];

  return (
    <div className="fixed left-4 top-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Outils</h3>

        {/* Formes et éléments */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Formes</h4>
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => handleAddItem(tool.type)}
              className={`
                w-full flex items-center space-x-2 px-3 py-2 rounded-lg
                ${tool.color} dark:bg-gray-700 dark:hover:bg-gray-600
                transition-all duration-200 ease-in-out
                hover:shadow-md transform hover:scale-105
                text-gray-700 dark:text-gray-300
              `}
              title={`Ajouter un ${tool.label}`}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Import d'image */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Images</h4>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105"
          >
            <span className="text-lg">🖼️</span>
            <span className="text-sm font-medium">Importer Image</span>
          </button>
        </div>

        {/* Style Panel Toggle */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Style</h4>
          <button
            onClick={() => setShowStylePanel(!showStylePanel)}
            className={`
              w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105
              ${
                showStylePanel
                  ? "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              }
            `}
            title="Afficher/Masquer le panneau de style"
          >
            <span className="text-lg">🎨</span>
            <span className="text-sm font-medium">Panneau Style</span>
          </button>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              disabled={!state.selectedItem}
              className={`
                flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium
                ${
                  state.selectedItem
                    ? "bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
                transition-all duration-200 ease-in-out
              `}
              title="Copier (Ctrl+C)"
            >
              📋
            </button>
            <button
              onClick={handlePaste}
              disabled={!state.clipboard}
              className={`
                flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium
                ${
                  state.clipboard
                    ? "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
                transition-all duration-200 ease-in-out
              `}
              title="Coller (Ctrl+V)"
            >
              📄
            </button>
            <button
              onClick={undo}
              disabled={state.historyIndex <= 0}
              className={`
                flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium
                ${
                  state.historyIndex > 0
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
                transition-all duration-200 ease-in-out
              `}
              title="Annuler (Ctrl+Z)"
            >
              ↩️
            </button>
            <button
              onClick={redo}
              disabled={state.historyIndex >= state.history.length - 1}
              className={`
                flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium
                ${
                  state.historyIndex < state.history.length - 1
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
                transition-all duration-200 ease-in-out
              `}
              title="Rétablir (Ctrl+Y)"
            >
              ↪️
            </button>
          </div>
        </div>

        {/* Tout effacer */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <button
            onClick={clearAll}
            disabled={state.items.length === 0}
            className={`
              w-full flex items-center space-x-2 px-3 py-2 rounded-lg
              ${
                state.items.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300"
              }
              transition-all duration-200 ease-in-out
              hover:shadow-md transform hover:scale-105
            `}
            title="Tout effacer"
          >
            <span className="text-lg">🗑️</span>
            <span className="text-sm font-medium">Tout effacer</span>
          </button>
        </div>

        {/* Informations */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 space-y-1">
          <p>Éléments: {state.items.length}</p>
          <p>
            Historique: {state.historyIndex + 1}/{state.history.length}
          </p>
          <p className="mt-2 text-xs">
            <strong>Raccourcis:</strong>
            <br />
            Delete: Supprimer
            <br />
            Escape: Désélectionner
            <br />
            Ctrl+Z: Annuler
            <br />
            Ctrl+Y: Rétablir
            <br />
            Double-clic: Éditer
            <br />
            ↑↓: Avant/Arrière-plan
          </p>
        </div>
      </div>
    </div>
  );
}
