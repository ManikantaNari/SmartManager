// Category icon utilities

function normalizeCategoryKey(category) {
    return String(category || '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
}

const CATEGORY_ICON_BODIES = {
    mattress: `
        <rect x="8" y="10" width="32" height="26" rx="3"/>
        <rect x="12" y="12" width="10" height="8" rx="2"/>
        <rect x="26" y="12" width="10" height="8" rx="2"/>
        <path d="M12 26h24"/>
        <path d="M12 30h24"/>
    `,
    cot: `
        <rect x="10" y="20" width="28" height="8" rx="2"/>
        <path d="M10 18v12M38 18v12"/>
        <path d="M14 28v8M34 28v8"/>
        <path d="M12 24h24"/>
    `,
    chair: `
        <rect x="16" y="10" width="16" height="10" rx="2"/>
        <rect x="14" y="20" width="20" height="8" rx="2"/>
        <path d="M16 28v10M32 28v10"/>
    `,
    sofa: `
        <rect x="10" y="18" width="28" height="12" rx="4"/>
        <rect x="8" y="22" width="8" height="8" rx="3"/>
        <rect x="32" y="22" width="8" height="8" rx="3"/>
        <path d="M14 30v6M34 30v6"/>
    `,
    pillow: `
        <rect x="8" y="16" width="32" height="16" rx="8"/>
        <path d="M12 22c6-2 18-2 24 0"/>
        <path d="M12 26c6 2 18 2 24 0"/>
    `,
    fan: `
        <circle cx="24" cy="24" r="3"/>
        <path d="M24 9c6 0 7 5 7 7s-1 3-7 3-7-1-7-3 1-7 7-7z"/>
        <path d="M39 24c0 6-5 7-7 7s-3-1-3-7 1-7 3-7 7 1 7 7z"/>
        <path d="M24 39c-6 0-7-5-7-7s1-3 7-3 7 1 7 3-1 7-7 7z"/>
        <path d="M9 24c0-6 5-7 7-7s3 1 3 7-1 7-3 7-7-1-7-7z"/>
    `,
    table: `
        <rect x="10" y="20" width="28" height="8" rx="2"/>
        <rect x="18" y="10" width="12" height="8" rx="1.5"/>
        <path d="M14 28v10M34 28v10M24 18v2"/>
    `,
    'dining table': `
        <rect x="10" y="18" width="28" height="8" rx="2"/>
        <rect x="4" y="18" width="6" height="10" rx="2"/>
        <rect x="38" y="18" width="6" height="10" rx="2"/>
        <rect x="6" y="12" width="6" height="6" rx="2"/>
        <rect x="36" y="12" width="6" height="6" rx="2"/>
        <path d="M14 26v12M34 26v12"/>
    `,
    'folding table': `
        <rect x="8" y="16" width="32" height="8" rx="2"/>
        <path d="M18 24v12M30 24v12M16 30h16"/>
    `,
    'official table': `
        <rect x="8" y="16" width="32" height="8" rx="2"/>
        <path d="M14 24v12M34 24v12M8 20h32"/>
    `,
    'tv stand': `
        <rect x="10" y="12" width="28" height="14" rx="2"/>
        <path d="M14 26v8M34 26v8M8 34h32"/>
    `,
    'shoe rack': `
        <rect x="10" y="12" width="28" height="24" rx="2"/>
        <path d="M10 20h28M10 28h28"/>
    `,
    'shoe racks': `
        <rect x="10" y="12" width="28" height="24" rx="2"/>
        <path d="M10 20h28M10 28h28"/>
    `,
    cooler: `
        <rect x="14" y="10" width="18" height="28" rx="3"/>
        <path d="M17 16h12M17 22h12M17 28h12M17 34h12"/>
        <circle cx="18" cy="40" r="2"/>
        <circle cx="30" cy="40" r="2"/>
    `,
    dressing: `
        <rect x="14" y="6" width="20" height="24" rx="4"/>
        <path d="M28 12l-6 6"/>
        <path d="M30 14l-6 6"/>
        <path d="M24 10c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z"/>
        <rect x="8" y="30" width="32" height="10" rx="2"/>
        <path d="M12 34h6M21 34h6M30 34h6"/>
        <path d="M10 40v4M38 40v4"/>
    `,
    almara: `
        <rect x="12" y="8" width="24" height="32" rx="2"/>
        <path d="M24 8v32M18 18h2M28 18h2"/>
    `,
    'almara leg': `
        <rect x="6" y="18" width="36" height="16" rx="3"/>
        <path d="M10 22h28M10 30h28M6 26h36"/>
    `,
    'fridge stand': `
        <rect x="12" y="14" width="24" height="20" rx="2"/>
        <path d="M16 20h16M16 28h16"/>
    `,
    default: `
        <rect x="10" y="12" width="28" height="24" rx="3"/>
        <path d="M16 20h16M16 28h16"/>
    `
};

export function getCategoryIcon(category) {
    const key = normalizeCategoryKey(category);
    const body = CATEGORY_ICON_BODIES[key]
        || (key.includes('tv stand') ? CATEGORY_ICON_BODIES['tv stand'] : null)
        || (key.includes('table')
            ? (key.includes('dining')
                ? CATEGORY_ICON_BODIES['dining table']
                : key.includes('folding')
                    ? CATEGORY_ICON_BODIES['folding table']
                    : key.includes('official')
                        ? CATEGORY_ICON_BODIES['official table']
                        : CATEGORY_ICON_BODIES.table)
            : null)
        || (key.includes('shoe rack') ? CATEGORY_ICON_BODIES['shoe rack'] : null)
        || CATEGORY_ICON_BODIES.default;

    return `<svg viewBox="0 0 48 48" fill="none" stroke="url(#category-icon-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${body}
    </svg>`;
}

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
