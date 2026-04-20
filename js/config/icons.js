// Category Icons - Dynamic from State

import { DEFAULT_ICON } from './constants.js';
import { State } from '../state/state.js';

// Get category icon from State.categoryEmojis or default to 📦
export function getCategoryIcon(category) {
    return State.categoryEmojis[category] || DEFAULT_ICON;
}

// Common emoji options for category picker
export const EMOJI_OPTIONS = [
    '📦', '🛏️', '🛋️', '🪑', '🪵', '📺', '🧺', '☁️',
    '🏠', '🚪', '🪞', '🖼️', '💡', '🔌', '🧹', '🧴',
    '👕', '👟', '🎒', '📚', '🎮', '⌚', '💎', '🛒'
];

/**
 * SVG Icons - Reusable icon strings
 * All icons are 24x24 viewBox unless otherwise specified
 */
export const SVG_ICONS = {
    /**
     * Edit/Pencil icon (14x14)
     */
    EDIT: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>`,

    /**
     * Delete/Trash icon (14x14)
     */
    DELETE: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        <path d="M10 11v6M14 11v6"/>
    </svg>`,

    /**
     * Close/X icon (20x20)
     */
    CLOSE: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12"/>
    </svg>`,

    /**
     * Plus/Add icon (20x20)
     */
    PLUS: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14"/>
    </svg>`,

    /**
     * Check/Checkmark icon (20x20)
     */
    CHECK: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5"/>
    </svg>`,

    /**
     * Arrow Right icon (16x16)
     */
    ARROW_RIGHT: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>`,

    /**
     * Arrow Left icon (16x16)
     */
    ARROW_LEFT: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>`,

    /**
     * Search/Magnifying glass icon (18x18)
     */
    SEARCH: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
    </svg>`,

    /**
     * Calendar icon (18x18)
     */
    CALENDAR: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>`,

    /**
     * User/Person icon (18x18)
     */
    USER: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>`,

    /**
     * Settings/Gear icon (18x18)
     */
    SETTINGS: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6M6 12H1m6 0h6m6 0h6m-3-7.07l-4.24 4.24m0 5.66l4.24 4.24m0-14.14l-4.24 4.24m-5.66 0L2.93 3.93"/>
    </svg>`,

    /**
     * Download icon (18x18)
     */
    DOWNLOAD: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>`,

    /**
     * Upload icon (18x18)
     */
    UPLOAD: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
    </svg>`,

    /**
     * Info/Information icon (18x18)
     */
    INFO: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
    </svg>`,

    /**
     * Warning/Alert icon (18x18)
     */
    WARNING: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
    </svg>`,

    /**
     * Camera/Photo icon (18x18)
     */
    CAMERA: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>`
};
