// PIN Modal Template

export const PinModalTemplate = `
<div class="modal-overlay" id="pinModal">
    <div class="modal">
        <div class="modal-header">
            <h3 class="modal-title" id="pinModalTitle" data-i18n="login.enterPin">Enter Owner PIN</h3>
            <button class="modal-close" onclick="closePinModal()">&times;</button>
        </div>
        <div class="pin-display" id="pinDisplay">
            <div class="pin-dot"></div>
            <div class="pin-dot"></div>
            <div class="pin-dot"></div>
            <div class="pin-dot"></div>
            <div class="pin-dot"></div>
        </div>
        <div class="pin-pad">
            <button class="pin-key" onclick="enterPin(1)">1</button>
            <button class="pin-key" onclick="enterPin(2)">2</button>
            <button class="pin-key" onclick="enterPin(3)">3</button>
            <button class="pin-key" onclick="enterPin(4)">4</button>
            <button class="pin-key" onclick="enterPin(5)">5</button>
            <button class="pin-key" onclick="enterPin(6)">6</button>
            <button class="pin-key" onclick="enterPin(7)">7</button>
            <button class="pin-key" onclick="enterPin(8)">8</button>
            <button class="pin-key" onclick="enterPin(9)">9</button>
            <button class="pin-key" onclick="clearPin()">C</button>
            <button class="pin-key" onclick="enterPin(0)">0</button>
            <button class="pin-key" onclick="deletePin()">&larr;</button>
        </div>
    </div>
</div>
`;
