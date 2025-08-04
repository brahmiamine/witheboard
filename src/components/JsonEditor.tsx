import { useState } from "react";
import { useWhiteboard } from "../context/WhiteboardContext";
import type { WhiteboardItem, ElementType } from "../types";

interface JsonEditorProps {
  isVisible: boolean;
  onClose: () => void;
}

export function JsonEditor({ isVisible, onClose }: JsonEditorProps) {
  const { addItem } = useWhiteboard();
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setError("");
      setSuccess("");

      if (Array.isArray(parsed)) {
        // Créer plusieurs éléments
        parsed.forEach((item, index) => {
          if (isValidItem(item)) {
            const position = {
              x: item.position?.x || 100 + index * 50,
              y: item.position?.y || 100 + index * 50,
            };
            addItem(item.type as ElementType, position, item.size);
          }
        });
        setSuccess(`${parsed.length} éléments créés avec succès !`);
      } else if (isValidItem(parsed)) {
        // Créer un seul élément
        const position = {
          x: parsed.position?.x || 100,
          y: parsed.position?.y || 100,
        };
        addItem(parsed.type as ElementType, position, parsed.size);
        setSuccess("Élément créé avec succès !");
      } else {
        setError("Format JSON invalide. Vérifiez la structure de vos données.");
      }
    } catch (err) {
      setError("JSON invalide. Vérifiez la syntaxe.");
      setSuccess("");
    }
  };

  const isValidItem = (item: any): item is Partial<WhiteboardItem> => {
    return item && item.type && typeof item.type === "string";
  };

  const getSampleJson = () => {
    return JSON.stringify(
      {
        type: "text",
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 },
        content: "Exemple de texte",
        color: "#000000",
        backgroundColor: "#ffffff",
        fontSize: 16,
        fontFamily: "Arial",
        fontWeight: "normal",
        textAlign: "center",
      },
      null,
      2
    );
  };

  const getMultipleItemsSample = () => {
    return JSON.stringify(
      [
        {
          type: "rectangle",
          position: { x: 100, y: 100 },
          size: { width: 150, height: 100 },
          backgroundColor: "#e3f2fd",
          content: "Rectangle bleu",
        },
        {
          type: "text",
          position: { x: 300, y: 100 },
          size: { width: 200, height: 50 },
          content: "Titre important",
          fontSize: 24,
          fontWeight: "bold",
          color: "#1976d2",
        },
        {
          type: "post-it",
          position: { x: 100, y: 250 },
          size: { width: 200, height: 150 },
          content: "Note importante\n\n- Point 1\n- Point 2",
          backgroundColor: "#fff3e0",
        },
      ],
      null,
      2
    );
  };

  const getCompleteExample = () => {
    return JSON.stringify(
      {
        type: "text",
        position: { x: 100, y: 100 },
        size: { width: 300, height: 80 },
        content: "Exemple complet avec tous les attributs",
        color: "#1976d2",
        backgroundColor: "#e3f2fd",
        borderColor: "#1976d2",
        borderWidth: 2,
        opacity: 1,
        rotation: 0,
        zIndex: 1,
        fontSize: 18,
        fontFamily: "Arial",
        fontWeight: "bold",
        fontStyle: "normal",
        textDecoration: "none",
        textAlign: "center",
      },
      null,
      2
    );
  };

  const getMultipleCompleteExample = () => {
    return JSON.stringify(
      [
        {
          type: "text",
          position: { x: 50, y: 50 },
          size: { width: 250, height: 60 },
          content: "Titre principal",
          color: "#000000",
          backgroundColor: "#ffffff",
          borderColor: "#000000",
          borderWidth: 1,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          fontSize: 24,
          fontFamily: "Arial",
          fontWeight: "bold",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
        },
        {
          type: "post-it",
          position: { x: 50, y: 150 },
          size: { width: 200, height: 150 },
          content: "Note importante\n\n- Point 1\n- Point 2\n- Point 3",
          color: "#000000",
          backgroundColor: "#fff3e0",
          borderColor: "#ff9800",
          borderWidth: 0,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          fontSize: 14,
          fontFamily: "Arial",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "left",
        },
        {
          type: "rectangle",
          position: { x: 300, y: 50 },
          size: { width: 150, height: 100 },
          content: "Rectangle avec texte",
          color: "#000000",
          backgroundColor: "#e8f5e8",
          borderColor: "#4caf50",
          borderWidth: 3,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          fontSize: 16,
          fontFamily: "Arial",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
        },
        {
          type: "circle",
          position: { x: 300, y: 200 },
          size: { width: 120, height: 120 },
          content: "Cercle",
          color: "#000000",
          backgroundColor: "#fce4ec",
          borderColor: "#e91e63",
          borderWidth: 2,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          fontSize: 16,
          fontFamily: "Arial",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
        },
        {
          type: "triangle",
          position: { x: 500, y: 50 },
          size: { width: 100, height: 100 },
          content: "Triangle",
          color: "#000000",
          backgroundColor: "#fff8e1",
          borderColor: "#ffc107",
          borderWidth: 1,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          fontSize: 14,
          fontFamily: "Arial",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
        },
        {
          type: "arrow",
          position: { x: 500, y: 200 },
          size: { width: 200, height: 50 },
          content: "Flèche",
          color: "#9c27b0",
          backgroundColor: "transparent",
          borderColor: "#9c27b0",
          borderWidth: 0,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          fontSize: 14,
          fontFamily: "Arial",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
        },
        {
          type: "line",
          position: { x: 50, y: 350 },
          size: { width: 300, height: 20 },
          content: "Ligne",
          color: "#607d8b",
          backgroundColor: "transparent",
          borderColor: "#607d8b",
          borderWidth: 0,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          fontSize: 14,
          fontFamily: "Arial",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
        },
      ],
      null,
      2
    );
  };

  const handleLoadSample = (sample: string) => {
    setJsonInput(sample);
    setError("");
    setSuccess("");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Éditeur JSON</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Exemples rapides */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Exemples rapides :</h3>
            <div className="flex space-x-2 flex-wrap gap-2">
              <button
                onClick={() => handleLoadSample(getSampleJson())}
                className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded border"
              >
                Élément simple
              </button>
              <button
                onClick={() => handleLoadSample(getMultipleItemsSample())}
                className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded border"
              >
                Multiples éléments
              </button>
              <button
                onClick={() => handleLoadSample(getCompleteExample())}
                className="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded border"
              >
                Exemple complet
              </button>
              <button
                onClick={() => handleLoadSample(getMultipleCompleteExample())}
                className="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded border"
              >
                Multiples complets
              </button>
            </div>
          </div>

          {/* Éditeur JSON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">JSON (objet unique ou tableau d'objets) :</label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-64 p-3 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
              placeholder="Collez votre JSON ici..."
            />
          </div>

          {/* Messages d'erreur/succès */}
          {error && <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">{success}</div>}

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg"
            >
              Annuler
            </button>
            <button onClick={handleCreateFromJson} className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              Créer les éléments
            </button>
          </div>

          {/* Documentation */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Structure JSON :</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                <strong>Propriétés obligatoires :</strong> type, position, size
              </p>
              <p>
                <strong>Types supportés :</strong> text, post-it, rectangle, circle, triangle, arrow, line, image
              </p>
              <p>
                <strong>Styles de texte :</strong> fontSize, fontFamily, fontWeight, fontStyle, textDecoration, textAlign, color
              </p>
              <p>
                <strong>Styles de forme :</strong> backgroundColor, borderColor, borderWidth, opacity, rotation, zIndex
              </p>
              <p>
                <strong>Propriétés avancées :</strong> startPoint, endPoint (pour flèches/lignes), imageUrl, imageAlt (pour images)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
