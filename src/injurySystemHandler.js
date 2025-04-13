import { extensionSettings } from '../index.js';
import { debug } from '../lib/utils.js';

export class InjurySystemHandler {
    static async processInjuries(message, currentInjuries = [], psychologicalState = {}) {
        if (!extensionSettings.injurySystem?.enabled) {
            return { injuries: currentInjuries, psychologicalState };
        }

        try {
            // Process new injuries from the message
            const newInjuries = await this.detectNewInjuries(message);
            
            // Update existing injuries
            const updatedInjuries = await this.updateExistingInjuries(currentInjuries);
            
            // Calculate psychological effects
            const updatedPsychologicalState = await this.calculatePsychologicalEffects([
                ...updatedInjuries,
                ...newInjuries
            ], psychologicalState);

            return {
                injuries: [...updatedInjuries, ...newInjuries],
                psychologicalState: updatedPsychologicalState
            };
        } catch (error) {
            debug("Error processing injuries:", error);
            return { injuries: currentInjuries, psychologicalState };
        }
    }

    static async detectNewInjuries(message) {
        const newInjuries = [];
        const injurySystem = extensionSettings.injurySystem;

        // Check for physical assaults
        for (const [action, severity] of Object.entries(injurySystem.InjurySeveritySystem.Assaults.PhysicalAssaults)) {
            if (message.toLowerCase().includes(action.toLowerCase())) {
                const baseSeverity = typeof severity === 'string' ? 
                    this.parseSeverityRange(severity) : 
                    severity;

                // Apply modifiers
                let finalSeverity = baseSeverity;
                if (message.toLowerCase().includes('restrained')) {
                    finalSeverity += 1;
                }
                if (message.toLowerCase().includes('weapon')) {
                    finalSeverity = Math.max(2, finalSeverity);
                }

                newInjuries.push({
                    injury: this.determineInjuryType(action, finalSeverity),
                    location: this.determineInjuryLocation(action, message),
                    severity: finalSeverity,
                    visible: true,
                    healing_status: this.calculateHealingTime(finalSeverity),
                    cause: action
                });
            }
        }

        return newInjuries;
    }

    static async updateExistingInjuries(currentInjuries) {
        return currentInjuries.map(injury => {
            const healingProgress = this.calculateHealingProgress(injury);
            return {
                ...injury,
                healing_status: healingProgress > 0 ? 
                    `${healingProgress} days remaining` : 
                    "Healed"
            };
        }).filter(injury => injury.healing_status !== "Healed");
    }

    static async calculatePsychologicalEffects(injuries, currentState) {
        const injurySystem = extensionSettings.injurySystem;
        const totalSeverity = injuries.reduce((sum, injury) => sum + injury.severity, 0);
        
        // Determine base psychological state
        let newState = { ...currentState };
        if (totalSeverity >= 6) {
            newState = { ...injurySystem.InjurySeveritySystem.PsychologicalStates.Collapsed };
        } else if (totalSeverity >= 3) {
            newState = { ...injurySystem.InjurySeveritySystem.PsychologicalStates.Destabilized };
        } else {
            newState = { ...injurySystem.InjurySeveritySystem.PsychologicalStates.Stable };
        }

        // Add specific effects based on injury types
        const effects = new Set();
        injuries.forEach(injury => {
            const severityEffects = injurySystem.InjurySeveritySystem.InjuryEffects[injury.severity];
            severityEffects.forEach(effect => effects.add(effect));
        });

        newState.effects = Array.from(effects);
        return newState;
    }

    static parseSeverityRange(range) {
        const [min, max] = range.split('-').map(Number);
        return Math.floor((min + max) / 2);
    }

    static determineInjuryType(action, severity) {
        const injuryTypes = {
            Slapping: "Bruising",
            Punching: "Bruising",
            Kicking: "Bruising",
            HairPulling: "Scalp pain",
            UsingObjectsAsWeapons: "Laceration",
            Biting: "Bite mark",
            TwistingLimbs: "Sprain",
            ThrowingRO: "Impact injury",
            Dragging: "Abrasion",
            Burning: "Burn",
            Stabbing: "Stab wound",
            BreakingBones: "Broken bone",
            Cutting: "Cut"
        };

        return injuryTypes[action] || "Injury";
    }

    static determineInjuryLocation(action, message) {
        const commonLocations = {
            Slapping: "Face",
            Punching: "Face/Torso",
            Kicking: "Legs/Torso",
            HairPulling: "Scalp",
            UsingObjectsAsWeapons: "Various",
            Biting: "Various",
            TwistingLimbs: "Limbs",
            ThrowingRO: "Various",
            Dragging: "Various",
            Burning: "Various",
            Stabbing: "Various",
            BreakingBones: "Various",
            Cutting: "Various"
        };

        return commonLocations[action] || "Various";
    }

    static calculateHealingTime(severity) {
        const healingRates = extensionSettings.injurySystem.healingRates;
        switch (severity) {
            case 1:
                return healingRates.mild;
            case 2:
                return healingRates.moderate;
            case 3:
                return healingRates.severe;
            default:
                return "Unknown";
        }
    }

    static calculateHealingProgress(injury) {
        const currentStatus = injury.healing_status;
        if (typeof currentStatus === 'string' && currentStatus.includes('days remaining')) {
            const daysRemaining = parseInt(currentStatus);
            return Math.max(0, daysRemaining - 1);
        }
        return 0;
    }
} 