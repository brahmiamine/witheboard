import { createContext, useContext, useReducer, useCallback } from "react";
import type { ReactNode } from "react";
import type { WhiteboardState, WhiteboardItem, Position, Size, ResizeHandle, ElementType } from "../types";

interface WhiteboardContextType {
  state: WhiteboardState;
  addItem: (type: ElementType, position: Position, size?: Size) => void;
  updateItemPosition: (id: string, position: Position) => void;
  updateItemSize: (id: string, size: Size) => void;
  selectItem: (id: string | null) => void;
  deleteItem: (id: string) => void;
  clearAll: () => void;
  setDragging: (isDragging: boolean) => void;
  setResizing: (isResizing: boolean, handle?: ResizeHandle) => void;
  updateItemContent: (id: string, content: string) => void;
  updateItemProperty: (id: string, property: keyof WhiteboardItem, value: any) => void;
  copyItem: (id: string) => void;
  pasteItem: (position: Position) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  importImage: (file: File) => void;
}

const initialState: WhiteboardState = {
  items: [],
  selectedItem: null,
  isDragging: false,
  isResizing: false,
  resizeHandle: null,
  clipboard: null,
  history: [[]],
  historyIndex: 0,
};

type Action =
  | { type: "ADD_ITEM"; payload: WhiteboardItem }
  | { type: "UPDATE_ITEM_POSITION"; payload: { id: string; position: Position } }
  | { type: "UPDATE_ITEM_SIZE"; payload: { id: string; size: Size } }
  | { type: "SELECT_ITEM"; payload: string | null }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "CLEAR_ALL" }
  | { type: "SET_DRAGGING"; payload: boolean }
  | { type: "SET_RESIZING"; payload: { isResizing: boolean; handle?: ResizeHandle } }
  | { type: "UPDATE_ITEM_CONTENT"; payload: { id: string; content: string } }
  | { type: "UPDATE_ITEM_PROPERTY"; payload: { id: string; property: keyof WhiteboardItem; value: any } }
  | { type: "COPY_ITEM"; payload: WhiteboardItem }
  | { type: "PASTE_ITEM"; payload: { item: WhiteboardItem; position: Position } }
  | { type: "SAVE_HISTORY" }
  | { type: "UNDO" }
  | { type: "REDO" };

function whiteboardReducer(state: WhiteboardState, action: Action): WhiteboardState {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        selectedItem: action.payload.id,
      };

    case "UPDATE_ITEM_POSITION":
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? { ...item, position: action.payload.position } : item)),
      };

    case "UPDATE_ITEM_SIZE":
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? { ...item, size: action.payload.size } : item)),
      };

    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem: action.payload,
        items: state.items.map((item) => ({
          ...item,
          selected: item.id === action.payload,
        })),
      };

    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        selectedItem: state.selectedItem === action.payload ? null : state.selectedItem,
      };

    case "CLEAR_ALL":
      return {
        ...state,
        items: [],
        selectedItem: null,
      };

    case "SET_DRAGGING":
      return {
        ...state,
        isDragging: action.payload,
      };

    case "SET_RESIZING":
      return {
        ...state,
        isResizing: action.payload.isResizing,
        resizeHandle: action.payload.handle || null,
      };

    case "UPDATE_ITEM_CONTENT":
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? { ...item, content: action.payload.content } : item)),
      };

    case "UPDATE_ITEM_PROPERTY":
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? { ...item, [action.payload.property]: action.payload.value } : item)),
      };

    case "COPY_ITEM":
      return {
        ...state,
        clipboard: action.payload,
      };

    case "PASTE_ITEM":
      const pastedItem = {
        ...action.payload.item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: action.payload.position,
        selected: true,
      };
      return {
        ...state,
        items: [...state.items, pastedItem],
        selectedItem: pastedItem.id,
      };

    case "SAVE_HISTORY":
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.items]);
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };

    case "UNDO":
      if (state.historyIndex > 0) {
        return {
          ...state,
          items: [...state.history[state.historyIndex - 1]],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          items: [...state.history[state.historyIndex + 1]],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    default:
      return state;
  }
}

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined);

export function WhiteboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(whiteboardReducer, initialState);

  const getDefaultSize = (type: ElementType): Size => {
    switch (type) {
      case "text":
        return { width: 200, height: 50 };
      case "arrow":
      case "line":
        return { width: 100, height: 20 };
      case "image":
        return { width: 200, height: 150 };
      default:
        return { width: 150, height: 100 };
    }
  };

  const getDefaultColor = (type: ElementType): string => {
    switch (type) {
      case "post-it":
        return "#fef3c7";
      case "rectangle":
        return "#dbeafe";
      case "circle":
        return "#fce7f3";
      case "triangle":
        return "#dcfce7";
      case "arrow":
      case "line":
        return "#000000";
      default:
        return "#ffffff";
    }
  };

  const addItem = useCallback(
    (type: ElementType, position: Position, size?: Size) => {
      const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const defaultSize = getDefaultSize(type);
      const newItem: WhiteboardItem = {
        id,
        type,
        position,
        size: size || defaultSize,
        content: type === "text" ? "Double-cliquez pour éditer" : "",
        backgroundColor: getDefaultColor(type),
        color: type === "arrow" || type === "line" ? "#000000" : "#000000",
        selected: true,
        rotation: 0,
        opacity: 1,
        zIndex: state.items.length + 1,
        fontSize: 16,
        fontFamily: "system-ui",
        fontWeight: "normal",
        textAlign: "center",
      };
      dispatch({ type: "ADD_ITEM", payload: newItem });
      dispatch({ type: "SAVE_HISTORY" });
    },
    [state.items.length]
  );

  const updateItemPosition = useCallback((id: string, position: Position) => {
    dispatch({ type: "UPDATE_ITEM_POSITION", payload: { id, position } });
  }, []);

  const updateItemSize = useCallback((id: string, size: Size) => {
    dispatch({ type: "UPDATE_ITEM_SIZE", payload: { id, size } });
  }, []);

  const selectItem = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_ITEM", payload: id });
  }, []);

  const deleteItem = useCallback((id: string) => {
    dispatch({ type: "DELETE_ITEM", payload: id });
    dispatch({ type: "SAVE_HISTORY" });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
    dispatch({ type: "SAVE_HISTORY" });
  }, []);

  const setDragging = useCallback((isDragging: boolean) => {
    dispatch({ type: "SET_DRAGGING", payload: isDragging });
  }, []);

  const setResizing = useCallback((isResizing: boolean, handle?: ResizeHandle) => {
    dispatch({ type: "SET_RESIZING", payload: { isResizing, handle } });
  }, []);

  const updateItemContent = useCallback((id: string, content: string) => {
    dispatch({ type: "UPDATE_ITEM_CONTENT", payload: { id, content } });
  }, []);

  const updateItemProperty = useCallback((id: string, property: keyof WhiteboardItem, value: any) => {
    dispatch({ type: "UPDATE_ITEM_PROPERTY", payload: { id, property, value } });
  }, []);

  const copyItem = useCallback(
    (id: string) => {
      const item = state.items.find((item) => item.id === id);
      if (item) {
        dispatch({ type: "COPY_ITEM", payload: { ...item, selected: false } });
      }
    },
    [state.items]
  );

  const pasteItem = useCallback(
    (position: Position) => {
      if (state.clipboard) {
        dispatch({ type: "PASTE_ITEM", payload: { item: state.clipboard, position } });
        dispatch({ type: "SAVE_HISTORY" });
      }
    },
    [state.clipboard]
  );

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const saveToHistory = useCallback(() => {
    dispatch({ type: "SAVE_HISTORY" });
  }, []);

  const importImage = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const position = { x: 100, y: 100 };
        const size = { width: 200, height: 150 };

        const newItem: WhiteboardItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "image",
          position,
          size,
          imageUrl,
          imageAlt: file.name,
          selected: true,
          rotation: 0,
          opacity: 1,
          zIndex: state.items.length + 1,
        };

        dispatch({ type: "ADD_ITEM", payload: newItem });
        dispatch({ type: "SAVE_HISTORY" });
      };
      reader.readAsDataURL(file);
    },
    [state.items.length]
  );

  const value: WhiteboardContextType = {
    state,
    addItem,
    updateItemPosition,
    updateItemSize,
    selectItem,
    deleteItem,
    clearAll,
    setDragging,
    setResizing,
    updateItemContent,
    updateItemProperty,
    copyItem,
    pasteItem,
    undo,
    redo,
    saveToHistory,
    importImage,
  };

  return <WhiteboardContext.Provider value={value}>{children}</WhiteboardContext.Provider>;
}

export function useWhiteboard() {
  const context = useContext(WhiteboardContext);
  if (context === undefined) {
    throw new Error("useWhiteboard must be used within a WhiteboardProvider");
  }
  return context;
}
