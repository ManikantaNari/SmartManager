// Authentication Module

import { MASTER_PIN } from '../config/index.js';
import { DOM, Toast } from '../utils/index.js';
import { Modal, PinPad } from '../components/index.js';
import { State, Storage } from '../state/index.js';

export const Auth = {
    pinLoaded: false,
    currentPinAction: '',
    onLoginComplete: null, // Callback for after login

    init(onLoginComplete) {
        this.onLoginComplete = onLoginComplete;

        // Initialize PIN pads
        PinPad.create({
            id: 'login',
            length: 5,
            displayId: 'loginPinDisplay',
            onComplete: (pin) => this.checkLoginPin(pin)
        });

        PinPad.create({
            id: 'master',
            length: 6,
            displayId: 'masterPinDisplay',
            onComplete: (pin) => this.checkMasterPin(pin)
        });

        PinPad.create({
            id: 'newPin',
            length: 5,
            displayId: 'newPinDisplay',
            onComplete: (pin) => this.saveNewOwnerPin(pin)
        });

        PinPad.create({
            id: 'settings',
            length: 5,
            displayId: 'pinDisplay',
            onComplete: (pin) => this.checkSettingsPin(pin)
        });
    },

    async selectRole(role) {
        if (role === 'admin') {
            if (!this.pinLoaded) {
                Toast.show('Loading... Please wait');
                let waitTime = 0;
                while (!this.pinLoaded && waitTime < 5000) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    waitTime += 100;
                }
            }
            DOM.hide(DOM.get('loginOptions'));
            DOM.addClass(DOM.get('loginPinSection'), 'show');
            PinPad.reset('login');
        } else {
            this.completeLogin('worker');
        }
    },

    checkLoginPin(pin) {
        if (pin === State.adminPin) {
            this.completeLogin('admin');
        } else {
            DOM.setText(DOM.get('loginError'), 'Incorrect PIN. Try again.');
            PinPad.reset('login');
        }
    },

    completeLogin(role) {
        State.userRole = role;
        State.isAdminUnlocked = (role === 'admin');

        document.body.classList.remove('is-admin', 'is-worker');
        document.body.classList.add('is-' + role);

        const badge = DOM.get('roleBadge');
        DOM.setText(badge, role === 'admin' ? 'Owner' : 'Manager');
        DOM.toggleClass(badge, 'worker', role === 'worker');

        DOM.addClass(DOM.get('loginScreen'), 'hidden');

        if (this.onLoginComplete) {
            this.onLoginComplete();
        }
    },

    logout() {
        if (!confirm('Switch to a different user?')) return;

        State.userRole = null;
        State.isAdminUnlocked = false;
        document.body.classList.remove('is-admin', 'is-worker');

        DOM.show(DOM.get('loginOptions'));
        DOM.removeClass(DOM.get('loginPinSection'), 'show');
        DOM.removeClass(DOM.get('forgotPinSection'), 'show');
        DOM.removeClass(DOM.get('newPinSection'), 'show');
        DOM.setText(DOM.get('loginError'), '');
        PinPad.reset('login');

        DOM.removeClass(DOM.get('loginScreen'), 'hidden');
    },

    backToRoleSelect() {
        DOM.show(DOM.get('loginOptions'));
        DOM.removeClass(DOM.get('loginPinSection'), 'show');
        DOM.removeClass(DOM.get('forgotPinSection'), 'show');
        DOM.removeClass(DOM.get('newPinSection'), 'show');
        DOM.setText(DOM.get('loginError'), '');
        PinPad.reset('login');
        PinPad.reset('master');
        PinPad.reset('newPin');
    },

    showForgotPin() {
        DOM.removeClass(DOM.get('loginPinSection'), 'show');
        DOM.addClass(DOM.get('forgotPinSection'), 'show');
        PinPad.reset('master');
        DOM.setText(DOM.get('masterPinError'), '');
    },

    backToLoginPin() {
        DOM.removeClass(DOM.get('forgotPinSection'), 'show');
        DOM.addClass(DOM.get('loginPinSection'), 'show');
        PinPad.reset('master');
        PinPad.reset('login');
    },

    checkMasterPin(pin) {
        if (pin === MASTER_PIN) {
            DOM.removeClass(DOM.get('forgotPinSection'), 'show');
            DOM.addClass(DOM.get('newPinSection'), 'show');
            PinPad.reset('newPin');
            DOM.setText(DOM.get('newPinError'), '');
        } else {
            DOM.setText(DOM.get('masterPinError'), 'Incorrect Master PIN. Try again.');
            PinPad.reset('master');
        }
    },

    saveNewOwnerPin(pin) {
        Storage.savePin(pin);
        DOM.removeClass(DOM.get('newPinSection'), 'show');
        DOM.addClass(DOM.get('loginPinSection'), 'show');
        PinPad.reset('login');
        PinPad.reset('newPin');
        PinPad.reset('master');
        DOM.setText(DOM.get('loginError'), '');
        alert('PIN updated successfully! Please login with your new PIN.');
    },

    showSettingsPinModal(action, onSuccess) {
        if (State.isAdminUnlocked) {
            if (onSuccess) onSuccess();
            return;
        }
        this.currentPinAction = action;
        this.onPinSuccess = onSuccess;
        PinPad.reset('settings');
        DOM.setText(DOM.get('pinModalTitle'), 'Enter Owner PIN');
        Modal.show('pinModal');
    },

    showSetPinModal() {
        this.currentPinAction = 'setPin';
        PinPad.reset('settings');
        DOM.setText(DOM.get('pinModalTitle'), 'Set New Owner PIN');
        Modal.show('pinModal');
    },

    checkSettingsPin(pin) {
        if (this.currentPinAction === 'setPin') {
            Storage.savePin(pin);
            Modal.hide('pinModal');
            Toast.show('PIN updated successfully');
            return;
        }

        if (pin === State.adminPin) {
            State.isAdminUnlocked = true;
            Modal.hide('pinModal');

            if (this.onPinSuccess) {
                this.onPinSuccess();
                this.onPinSuccess = null;
            } else {
                Toast.show('Owner access granted');
            }
        } else {
            Toast.show('Incorrect PIN');
            PinPad.reset('settings');
        }
    },

    closePinModal() {
        Modal.hide('pinModal');
        PinPad.reset('settings');
    }
};
