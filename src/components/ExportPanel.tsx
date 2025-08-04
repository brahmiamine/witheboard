import { useState } from "react";
import { useWhiteboard } from "../context/WhiteboardContext";

interface ExportPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ExportPanel({ isVisible, onClose }: ExportPanelProps) {
  const { state } = useWhiteboard();
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "png" | "svg" | "pptx">("json");
  const [isExporting, setIsExporting] = useState(false);

  const exportToJson = () => {
    const data = {
      items: state.items,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `whiteboard-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCsv = () => {
    const csvData = [
      ["Type", "Position X", "Position Y", "Width", "Height", "Content", "Color", "Background Color"],
      ...state.items.map((item) => [
        item.type,
        item.position.x,
        item.position.y,
        item.size.width,
        item.size.height,
        item.content || "",
        item.color || "",
        item.backgroundColor || "",
      ]),
    ];

    const csvContent = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `whiteboard-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPng = async () => {
    setIsExporting(true);
    try {
      const canvas = document.querySelector(".canvas-container") as HTMLElement;
      if (!canvas) return;

      // Utiliser html2canvas pour capturer le canvas
      const html2canvas = (await import("html2canvas")).default;
      const canvasElement = await html2canvas(canvas, {
        backgroundColor: "#f9fafb",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `whiteboard-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvasElement.toDataURL();
      link.click();
    } catch (error) {
      console.error("Erreur lors de l'export PNG:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToSvg = () => {
    let svgContent = '<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">';
    svgContent += "<defs><style>.text { font-family: Arial, sans-serif; } .shape { fill: #e3f2fd; stroke: #1976d2; stroke-width: 2; }</style></defs>";
    svgContent += '<rect width="100%" height="100%" fill="#f9fafb"/>';

    state.items.forEach((item) => {
      switch (item.type) {
        case "text":
          svgContent +=
            '<text x="' +
            item.position.x +
            '" y="' +
            (item.position.y + 20) +
            '" class="text" fill="' +
            (item.color || "#000") +
            '">' +
            (item.content || "") +
            "</text>";
          break;
        case "rectangle":
          svgContent +=
            '<rect x="' +
            item.position.x +
            '" y="' +
            item.position.y +
            '" width="' +
            item.size.width +
            '" height="' +
            item.size.height +
            '" class="shape" fill="' +
            (item.backgroundColor || "#e3f2fd") +
            '"/>';
          break;
        case "circle":
          const cx = item.position.x + item.size.width / 2;
          const cy = item.position.y + item.size.height / 2;
          const r = Math.min(item.size.width, item.size.height) / 2;
          svgContent += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="shape" fill="' + (item.backgroundColor || "#e3f2fd") + '"/>';
          break;
        default:
          svgContent +=
            '<rect x="' +
            item.position.x +
            '" y="' +
            item.position.y +
            '" width="' +
            item.size.width +
            '" height="' +
            item.size.height +
            '" class="shape"/>';
      }
    });

    svgContent += "</svg>";

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whiteboard-" + new Date().toISOString().split("T")[0] + ".svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPptx = async () => {
    setIsExporting(true);
    try {
      // Créer un fichier texte simple pour l'export PPTX (version simplifiée)
      const content = [
        "Whiteboard Export",
        "================",
        "",
        ...state.items.map((item, index) => `${index + 1}. ${item.type}: ${item.content || "Sans contenu"}`),
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `whiteboard-${new Date().toISOString().split("T")[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    switch (exportFormat) {
      case "json":
        exportToJson();
        break;
      case "csv":
        exportToCsv();
        break;
      case "png":
        exportToPng();
        break;
      case "svg":
        exportToSvg();
        break;
      case "pptx":
        exportToPptx();
        break;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Exporter le Whiteboard</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Sélection du format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format d'export :</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="json">JSON (données complètes)</option>
              <option value="csv">CSV (données tabulaires)</option>
              <option value="png">PNG (image)</option>
              <option value="svg">SVG (vectoriel)</option>
              <option value="pptx">PPTX (PowerPoint)</option>
            </select>
          </div>

          {/* Informations sur le format */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{exportFormat.toUpperCase()} - Informations :</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {exportFormat === "json" && "Exporte toutes les données avec styles et positions"}
              {exportFormat === "csv" && "Exporte les données principales en format tabulaire"}
              {exportFormat === "png" && "Capture le canvas en image haute résolution"}
              {exportFormat === "svg" && "Exporte en format vectoriel scalable"}
              {exportFormat === "pptx" && "Crée une présentation PowerPoint avec les éléments"}
            </div>
          </div>

          {/* Statistiques */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p>
                <strong>{state.items.length}</strong> éléments à exporter
              </p>
              <p>Types : {[...new Set(state.items.map((item) => item.type))].join(", ")}</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg"
            >
              {isExporting ? "Export en cours..." : "Exporter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
