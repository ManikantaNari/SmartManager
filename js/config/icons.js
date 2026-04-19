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
