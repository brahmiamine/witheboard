interface ZoomControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
}

export function ZoomControls({ zoom, setZoom }: ZoomControlsProps) {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors"
          title="Zoom arrière"
        >
          −
        </button>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>

        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors"
          title="Zoom avant"
        >
          +
        </button>

        <button
          onClick={handleZoomReset}
          className="w-8 h-8 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg flex items-center justify-center text-blue-700 dark:text-blue-300 transition-colors"
          title="Zoom 100%"
        >
          100%
        </button>
      </div>
    </div>
  );
}
