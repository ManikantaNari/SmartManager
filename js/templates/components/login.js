// Login Screen Component Template

export const LoginTemplate = `
<div class="login-screen" id="loginScreen">
    <div class="login-logo">ME</div>
    <h1 class="login-title">Manikanta Enterprises</h1>
    <p class="login-subtitle" id="loginSubtitle">Loading data...</p>

    <!-- Initial Loading -->
    <div id="loginLoading" style="display: flex; flex-direction: column; align-items: center; padding: 40px;">
        <div class="loader-spinner" style="border-color: rgba(255,255,255,0.2); border-top-color: white;"></div>
        <p style="color: rgba(255,255,255,0.8); margin-top: 16px; font-size: 14px;">Syncing your data...</p>
    </div>

    <div class="login-options" id="loginOptions" style="display: none;">
        <div class="login-btn admin" onclick="selectRole('admin')">
            <h3>Owner</h3>
            <p>Full access - requires PIN</p>
        </div>
        <div class="login-btn" onclick="selectRole('worker')">
            <h3>Manager</h3>
            <p>Sales & daily operations</p>
        </div>
    </div>

    <!-- Owner PIN Entry -->
    <div class="login-pin-section" id="loginPinSection">
        <p style="color: white; text-align: center; margin-bottom: 20px;">Enter Owner PIN</p>
        <div class="login-pin-display" id="loginPinDisplay">
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
        </div>
        <div class="login-pin-pad">
            <button class="login-pin-key" onclick="enterLoginPin(1)">1</button>
            <button class="login-pin-key" onclick="enterLoginPin(2)">2</button>
            <button class="login-pin-key" onclick="enterLoginPin(3)">3</button>
            <button class="login-pin-key" onclick="enterLoginPin(4)">4</button>
            <button class="login-pin-key" onclick="enterLoginPin(5)">5</button>
            <button class="login-pin-key" onclick="enterLoginPin(6)">6</button>
            <button class="login-pin-key" onclick="enterLoginPin(7)">7</button>
            <button class="login-pin-key" onclick="enterLoginPin(8)">8</button>
            <button class="login-pin-key" onclick="enterLoginPin(9)">9</button>
            <button class="login-pin-key" onclick="clearLoginPin()">C</button>
            <button class="login-pin-key" onclick="enterLoginPin(0)">0</button>
            <button class="login-pin-key" onclick="deleteLoginPin()">&larr;</button>
        </div>
        <p class="login-error" id="loginError"></p>
        <button class="login-back" onclick="backToRoleSelect()">Back to role selection</button>
        <button class="login-back" onclick="showForgotPin()" style="margin-top: 10px; color: #667eea;">Forgot PIN?</button>
    </div>

    <!-- Master PIN Entry (Forgot PIN) -->
    <div class="login-pin-section" id="forgotPinSection">
        <p style="color: white; text-align: center; margin-bottom: 20px;">Enter Master PIN (6 digits)</p>
        <div class="login-pin-display" id="masterPinDisplay">
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
        </div>
        <div class="login-pin-pad">
            <button class="login-pin-key" onclick="enterMasterPin(1)">1</button>
            <button class="login-pin-key" onclick="enterMasterPin(2)">2</button>
            <button class="login-pin-key" onclick="enterMasterPin(3)">3</button>
            <button class="login-pin-key" onclick="enterMasterPin(4)">4</button>
            <button class="login-pin-key" onclick="enterMasterPin(5)">5</button>
            <button class="login-pin-key" onclick="enterMasterPin(6)">6</button>
            <button class="login-pin-key" onclick="enterMasterPin(7)">7</button>
            <button class="login-pin-key" onclick="enterMasterPin(8)">8</button>
            <button class="login-pin-key" onclick="enterMasterPin(9)">9</button>
            <button class="login-pin-key" onclick="clearMasterPin()">C</button>
            <button class="login-pin-key" onclick="enterMasterPin(0)">0</button>
            <button class="login-pin-key" onclick="deleteMasterPin()">&larr;</button>
        </div>
        <p class="login-error" id="masterPinError"></p>
        <button class="login-back" onclick="backToLoginPin()">Back to PIN entry</button>
    </div>

    <!-- Set New PIN -->
    <div class="login-pin-section" id="newPinSection">
        <p style="color: white; text-align: center; margin-bottom: 20px;">Set New Owner PIN (5 digits)</p>
        <div class="login-pin-display" id="newPinDisplay">
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
            <div class="login-pin-dot"></div>
        </div>
        <div class="login-pin-pad">
            <button class="login-pin-key" onclick="enterNewPin(1)">1</button>
            <button class="login-pin-key" onclick="enterNewPin(2)">2</button>
            <button class="login-pin-key" onclick="enterNewPin(3)">3</button>
            <button class="login-pin-key" onclick="enterNewPin(4)">4</button>
            <button class="login-pin-key" onclick="enterNewPin(5)">5</button>
            <button class="login-pin-key" onclick="enterNewPin(6)">6</button>
            <button class="login-pin-key" onclick="enterNewPin(7)">7</button>
            <button class="login-pin-key" onclick="enterNewPin(8)">8</button>
            <button class="login-pin-key" onclick="enterNewPin(9)">9</button>
            <button class="login-pin-key" onclick="clearNewPin()">C</button>
            <button class="login-pin-key" onclick="enterNewPin(0)">0</button>
            <button class="login-pin-key" onclick="deleteNewPin()">&larr;</button>
        </div>
        <p class="login-error" id="newPinError"></p>
    </div>
</div>
`;
