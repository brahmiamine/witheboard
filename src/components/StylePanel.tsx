import React from "react";
import { useWhiteboard } from "../context/WhiteboardContext";

interface StylePanelProps {
  isVisible: boolean;
}

const colors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ffa500",
  "#800080",
  "#008000",
  "#ffc0cb",
  "#a52a2a",
  "#808080",
  "#000080",
  "#800000",
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
const fontFamilies = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana"];
const textAlignments = ["left", "center", "right"];

export function StylePanel({ isVisible }: StylePanelProps) {
  const { state, updateItemProperty } = useWhiteboard();
  const selectedItem = state.items.find((item) => item.id === state.selectedItem);

  if (!isVisible || !selectedItem) return null;

  // Vérifier si l'élément peut avoir du texte
  const hasText = selectedItem.type === "text" || selectedItem.type === "post-it" || selectedItem.content;

  const handleColorChange = (property: "color" | "backgroundColor" | "borderColor") => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateItemProperty(selectedItem.id, property, e.target.value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateItemProperty(selectedItem.id, "fontSize", parseInt(e.target.value));
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateItemProperty(selectedItem.id, "fontFamily", e.target.value);
  };

  const handleTextAlignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateItemProperty(selectedItem.id, "textAlign", e.target.value as "left" | "center" | "right");
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateItemProperty(selectedItem.id, "fontWeight", e.target.value);
  };

  const handleFontStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateItemProperty(selectedItem.id, "fontStyle", e.target.value);
  };

  const handleTextDecorationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateItemProperty(selectedItem.id, "textDecoration", e.target.value);
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateItemProperty(selectedItem.id, "borderWidth", parseInt(e.target.value) || 0);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateItemProperty(selectedItem.id, "opacity", parseFloat(e.target.value));
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateItemProperty(selectedItem.id, "rotation", parseInt(e.target.value) || 0);
  };

  return (
    <div className="fixed right-4 top-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 w-80 max-h-[90vh] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Style</h3>

      <div className="space-y-4">
        {/* Couleurs */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Couleurs</h4>

          {hasText && (
            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Couleur du texte:</label>
              <input
                type="color"
                value={selectedItem.color || "#000000"}
                onChange={handleColorChange("color")}
                className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}

          <div className="mb-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Couleur de fond:</label>
            <input
              type="color"
              value={selectedItem.backgroundColor || "#ffffff"}
              onChange={handleColorChange("backgroundColor")}
              className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="mb-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Couleur de bordure:</label>
            <input
              type="color"
              value={selectedItem.borderColor || "#000000"}
              onChange={handleColorChange("borderColor")}
              className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Propriétés de texte */}
        {hasText && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Style de texte</h4>

            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Taille de police:</label>
              <select
                value={selectedItem.fontSize || 16}
                onChange={handleFontSizeChange}
                className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Police:</label>
              <select
                value={selectedItem.fontFamily || "Arial"}
                onChange={handleFontFamilyChange}
                className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Style de police:</label>
              <select
                value={selectedItem.fontWeight || "normal"}
                onChange={handleFontWeightChange}
                className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="normal">Normal</option>
                <option value="bold">Gras</option>
                <option value="100">Très fin</option>
                <option value="200">Fin</option>
                <option value="300">Léger</option>
                <option value="400">Normal</option>
                <option value="500">Moyen</option>
                <option value="600">Semi-gras</option>
                <option value="700">Gras</option>
                <option value="800">Extra-gras</option>
                <option value="900">Très gras</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Style:</label>
              <select
                value={selectedItem.fontStyle || "normal"}
                onChange={handleFontStyleChange}
                className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="normal">Normal</option>
                <option value="italic">Italique</option>
                <option value="oblique">Oblique</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Décoration:</label>
              <select
                value={selectedItem.textDecoration || "none"}
                onChange={handleTextDecorationChange}
                className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="none">Aucune</option>
                <option value="underline">Souligné</option>
                <option value="line-through">Barré</option>
                <option value="overline">Ligne au-dessus</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">Alignement:</label>
              <select
                value={selectedItem.textAlign || "center"}
                onChange={handleTextAlignChange}
                className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                {textAlignments.map((align) => (
                  <option key={align} value={align}>
                    {align === "left" ? "Gauche" : align === "center" ? "Centre" : "Droite"}
                  </option>
                ))}
              </select>
            </div>

            {/* Boutons de style rapide */}
            <div className="mb-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Style rapide:</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => updateItemProperty(selectedItem.id, "fontWeight", selectedItem.fontWeight === "bold" ? "normal" : "bold")}
                  className={`px-2 py-1 text-xs rounded border ${
                    selectedItem.fontWeight === "bold"
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  }`}
                  title="Gras"
                >
                  B
                </button>
                <button
                  onClick={() => updateItemProperty(selectedItem.id, "fontStyle", selectedItem.fontStyle === "italic" ? "normal" : "italic")}
                  className={`px-2 py-1 text-xs rounded border ${
                    selectedItem.fontStyle === "italic"
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  }`}
                  title="Italique"
                >
                  I
                </button>
                <button
                  onClick={() =>
                    updateItemProperty(selectedItem.id, "textDecoration", selectedItem.textDecoration === "underline" ? "none" : "underline")
                  }
                  className={`px-2 py-1 text-xs rounded border ${
                    selectedItem.textDecoration === "underline"
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  }`}
                  title="Souligné"
                >
                  U
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Propriétés générales */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Propriétés</h4>

          <div className="mb-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Épaisseur de bordure:</label>
            <input
              type="number"
              min="0"
              max="20"
              value={selectedItem.borderWidth || 0}
              onChange={handleBorderWidthChange}
              className="w-full p-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>

          <div className="mb-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Opacité:</label>
            <input type="range" min="0" max="1" step="0.1" value={selectedItem.opacity || 1} onChange={handleOpacityChange} className="w-full" />
            <span className="text-xs text-gray-500">{(selectedItem.opacity || 1) * 100}%</span>
          </div>

          <div className="mb-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Rotation:</label>
            <input type="range" min="0" max="360" value={selectedItem.rotation || 0} onChange={handleRotationChange} className="w-full" />
            <span className="text-xs text-gray-500">{selectedItem.rotation || 0}°</span>
          </div>
        </div>

        {/* Palette de couleurs rapide */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Palette rapide</h4>
          <div className="grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => updateItemProperty(selectedItem.id, "backgroundColor", color)}
                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
