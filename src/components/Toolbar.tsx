import { useRef, useState } from "react";
import { useWhiteboard } from "../context/WhiteboardContext";
import type { ElementType } from "../types";
import { JsonEditor } from "./JsonEditor";

import { CollaborationPanel } from "./CollaborationPanel";
import { ExportPanel } from "./ExportPanel";

export function Toolbar() {
  const { state, addItem, copyItem, pasteItem, undo, redo, importImage } = useWhiteboard();
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools: { type: ElementType; label: string; icon: string; color: string }[] = [
    { type: "post-it", label: "Post-it", icon: "📝", color: "bg-yellow-400" },
    { type: "rectangle", label: "Rectangle", icon: "⬜", color: "bg-blue-400" },
    { type: "text", label: "Texte", icon: "T", color: "bg-gray-400" },
    { type: "circle", label: "Cercle", icon: "⭕", color: "bg-pink-400" },
    { type: "triangle", label: "Triangle", icon: "🔺", color: "bg-green-400" },
    { type: "arrow", label: "Flèche", icon: "➡️", color: "bg-purple-400" },
    { type: "line", label: "Ligne", icon: "➖", color: "bg-orange-400" },
  ];

  const handleAddItem = (type: ElementType) => {
    const position = {
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: Math.random() * (window.innerHeight - 200) + 100,
    };
    addItem(type, position);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="fixed left-4 top-4 z-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 w-64">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Outils</h2>

        <div className="space-y-4">
          {/* Formes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Formes</h3>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => handleAddItem(tool.type)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="text-sm font-medium">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Images</h3>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105"
            >
              <span className="text-lg">🖼️</span>
              <span className="text-sm font-medium">Importer image</span>
            </button>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => copyItem(state.selectedItem!)}
                disabled={!state.selectedItem}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                  state.selectedItem
                    ? "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>📋</span>
                <span>Copier</span>
              </button>

              <button
                onClick={() => pasteItem({ x: 100, y: 100 })}
                disabled={!state.clipboard}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                  state.clipboard
                    ? "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>📄</span>
                <span>Coller</span>
              </button>

              <button
                onClick={undo}
                disabled={state.historyIndex <= 0}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                  state.historyIndex > 0
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>↶</span>
                <span>Annuler</span>
              </button>

              <button
                onClick={redo}
                disabled={state.historyIndex >= state.history.length - 1}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                  state.historyIndex < state.history.length - 1
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>↷</span>
                <span>Rétablir</span>
              </button>
            </div>
          </div>

          {/* Avancé */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Avancé</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowJsonEditor(true)}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-300 transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105"
              >
                <span className="text-lg">{}</span>
                <span className="text-sm font-medium">Éditeur JSON</span>
              </button>

              <button
                onClick={() => setShowExportPanel(true)}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-300 transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105"
              >
                <span className="text-lg">📤</span>
                <span className="text-sm font-medium">Exporter</span>
              </button>

              <button
                onClick={() => setShowCollaborationPanel(true)}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-700 dark:bg-teal-900 dark:hover:bg-teal-800 dark:text-teal-300 transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105"
              >
                <span className="text-lg">👥</span>
                <span className="text-sm font-medium">Collaboration</span>
              </button>
            </div>
          </div>

          {/* Style Panel Toggle */}
          <div>
            <button
              onClick={() => setShowStylePanel(!showStylePanel)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-md transform hover:scale-105 ${
                showStylePanel
                  ? "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              }`}
            >
              <span className="text-lg">🎨</span>
              <span className="text-sm font-medium">Panneau de style</span>
            </button>
          </div>

          {/* Tout effacer */}
          <div>
            <button
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
                  // clearAll function would be called here
                }
              }}
              disabled={state.items.length === 0}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out ${
                state.items.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300"
              }`}
            >
              <span className="text-lg">🗑️</span>
              <span className="text-sm font-medium">Tout effacer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <JsonEditor isVisible={showJsonEditor} onClose={() => setShowJsonEditor(false)} />
      <ExportPanel isVisible={showExportPanel} onClose={() => setShowExportPanel(false)} />
      <CollaborationPanel isVisible={showCollaborationPanel} onClose={() => setShowCollaborationPanel(false)} />
    </>
  );
}
