// PIN Pad Component

import { DOM } from '../utils';

export const PinPad = {
    instances: {},

    // Create a new PIN pad instance
    create(config) {
        const { id, length = 5, displayId, onComplete, onClear } = config;
        this.instances[id] = {
            value: '',
            length,
            displayId,
            onComplete,
            onClear
        };
        return this;
    },

    // Enter a digit
    enter(id, num) {
        const inst = this.instances[id];
        if (!inst || inst.value.length >= inst.length) return;

        inst.value += num;
        this.updateDisplay(id);

        // Auto-submit when PIN is complete
        if (inst.value.length === inst.length) {
            setTimeout(() => inst.onComplete(inst.value), 200);
        }
    },

    // Delete last digit
    delete(id) {
        const inst = this.instances[id];
        if (!inst) return;
        inst.value = inst.value.slice(0, -1);
        this.updateDisplay(id);
    },

    // Clear all digits
    clear(id) {
        const inst = this.instances[id];
        if (!inst) return;
        inst.value = '';
        this.updateDisplay(id);
        if (inst.onClear) inst.onClear();
    },

    // Reset PIN pad
    reset(id) {
        const inst = this.instances[id];
        if (inst) {
            inst.value = '';
            this.updateDisplay(id);
        }
    },

    // Get current value
    getValue(id) {
        return this.instances[id]?.value || '';
    },

    // Update visual display of filled dots
    updateDisplay(id) {
        const inst = this.instances[id];
        if (!inst) return;

        const dots = DOM.findAll(`#${inst.displayId} .login-pin-dot, #${inst.displayId} .pin-dot`);
        dots.forEach((dot, i) => {
            DOM.toggleClass(dot, 'filled', i < inst.value.length);
        });
    }
};
