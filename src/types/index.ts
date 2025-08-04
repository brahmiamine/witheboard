export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface ResizeHandle {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left';
    cursor: string;
}

export type ElementType = 'post-it' | 'rectangle' | 'text' | 'arrow' | 'circle' | 'triangle' | 'line' | 'image';

export interface WhiteboardItem {
    id: string;
    type: ElementType;
    position: Position;
    size: Size;
    content?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    selected?: boolean;
    rotation?: number;
    opacity?: number;
    zIndex?: number;
    // Pour les flèches et lignes
    startPoint?: Position;
    endPoint?: Position;
    // Pour les images
    imageUrl?: string;
    imageAlt?: string;
    // Pour le texte
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
    textAlign?: 'left' | 'center' | 'right';
}

export interface WhiteboardState {
    items: WhiteboardItem[];
    selectedItem: string | null;
    isDragging: boolean;
    isResizing: boolean;
    resizeHandle: ResizeHandle | null;
    clipboard: WhiteboardItem | null;
    history: WhiteboardItem[][];
    historyIndex: number;
}

export type ToolType = ElementType | 'select' | 'clear' | 'undo' | 'redo' | 'copy' | 'paste';

export interface ColorPalette {
    name: string;
    colors: string[];
}

export interface ImageUpload {
    file: File;
    url: string;
    name: string;
} 