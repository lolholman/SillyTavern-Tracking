import { extensionSettings } from '../settings/settings.js';

export class InjuryTracker {
    constructor() {
        this.injuries = new Map(); // Map of characterId -> array of injuries
        this.psychologicalStates = new Map(); // Map of characterId -> current state
        this.uiHandler = null;
    }

    setUIHandler(handler) {
        this.uiHandler = handler;
    }

    addInjury(characterId, injury) {
        if (!this.injuries.has(characterId)) {
            this.injuries.set(characterId, []);
        }
        this.injuries.get(characterId).push(injury);
        this.updateUI();
    }

    removeInjury(characterId, injuryIndex) {
        if (this.injuries.has(characterId)) {
            const injuries = this.injuries.get(characterId);
            injuries.splice(injuryIndex, 1);
            if (injuries.length === 0) {
                this.injuries.delete(characterId);
            }
            this.updateUI();
        }
    }

    setPsychologicalState(characterId, state) {
        if (!extensionSettings.injurySystem.psychologicalStates[state]) {
            console.error(`Invalid psychological state: ${state}`);
            return;
        }
        this.psychologicalStates.set(characterId, state);
        this.updateUI();
    }

    getInjuries(characterId) {
        return this.injuries.get(characterId) || [];
    }

    getPsychologicalState(characterId) {
        return this.psychologicalStates.get(characterId) || extensionSettings.injurySystem.defaultState;
    }

    updateUI() {
        if (this.uiHandler) {
            this.uiHandler.updateDisplay(this.injuries, this.psychologicalStates);
        }
    }

    // Save state to localStorage
    saveState() {
        const state = {
            injuries: Array.from(this.injuries.entries()),
            psychologicalStates: Array.from(this.psychologicalStates.entries())
        };
        localStorage.setItem('injuryTrackerState', JSON.stringify(state));
    }

    // Load state from localStorage
    loadState() {
        const savedState = localStorage.getItem('injuryTrackerState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.injuries = new Map(state.injuries);
            this.psychologicalStates = new Map(state.psychologicalStates);
            this.updateUI();
        }
    }
} 