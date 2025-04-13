import { InjuryTracker } from './handlers/InjuryTracker.js';
import { InjuryUIHandler } from './handlers/InjuryUIHandler.js';

class InjurySystem {
    constructor() {
        this.tracker = new InjuryTracker();
        this.uiHandler = new InjuryUIHandler();
        this.tracker.setUIHandler(this.uiHandler);
        this.initialize();
    }

    initialize() {
        // Load saved state
        this.tracker.loadState();

        // Set up event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.uiHandler.initialize();
        });

        // Save state before unloading
        window.addEventListener('beforeunload', () => {
            this.tracker.saveState();
        });
    }
}

// Initialize the system
const injurySystem = new InjurySystem();
export default injurySystem; 