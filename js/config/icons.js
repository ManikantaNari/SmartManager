// Category Icons Mapping

import { DEFAULT_ICON } from './constants.js';

export const CATEGORY_ICONS = {
    'Mattress': '🛏️',
    'Cot': '🛏️',
    'TV Stand': '📺',
    'Chair': '🪑',
    'Table': '🪵',
    'Fan': '☢️',
    'Pillow': '☁️',
    'Bed Sheet': '🧺',
    'Sofa': '🛋️',
    'Dining Table': '🍽️',
    'Shoe Rack': '👟'
};

export function getCategoryIcon(category) {
    return CATEGORY_ICONS[category] || DEFAULT_ICON;
}
