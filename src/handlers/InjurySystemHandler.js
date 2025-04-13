import { extensionSettings } from '../settings/settings.js';

export class InjurySystemHandler {
    constructor() {
        this.injuries = new Map();
        this.psychologicalState = 'stable';
    }

    addInjury(characterId, injury) {
        if (!this.injuries.has(characterId)) {
            this.injuries.set(characterId, []);
        }
        this.injuries.get(characterId).push(injury);
    }

    removeInjury(characterId, injuryId) {
        if (this.injuries.has(characterId)) {
            const injuries = this.injuries.get(characterId);
            const index = injuries.findIndex(i => i.id === injuryId);
            if (index !== -1) {
                injuries.splice(index, 1);
            }
        }
    }

    getInjuries(characterId) {
        return this.injuries.get(characterId) || [];
    }

    setPsychologicalState(state) {
        if (extensionSettings.injurySystem.psychologicalStates[state]) {
            this.psychologicalState = state;
        }
    }

    getPsychologicalState() {
        return this.psychologicalState;
    }

    generateTrackerMessage() {
        let message = "**Injury Tracker**\n\n";
        
        // Add injuries for each character
        for (const [characterId, injuries] of this.injuries) {
            if (injuries.length > 0) {
                message += `**${characterId}**\n`;
                injuries.forEach(injury => {
                    message += `- ${injury.description} (${injury.severity})\n`;
                });
                message += "\n";
            }
        }

        // Add psychological state
        const state = extensionSettings.injurySystem.psychologicalStates[this.psychologicalState];
        message += `**Psychological State**: ${state.name}\n`;
        message += `*${state.description}*`;

        return message;
    }

    parseTrackerMessage(message) {
        const trackerRegex = /\*\*Injury Tracker\*\*\n\n([\s\S]*?)\n\n\*\*Psychological State\*\*: (.*?)\n\*(.*?)\*/;
        const match = message.match(trackerRegex);
        
        if (match) {
            // Clear existing injuries
            this.injuries.clear();
            
            // Parse injuries
            const injuriesSection = match[1];
            const characterBlocks = injuriesSection.split('\n\n');
            
            characterBlocks.forEach(block => {
                const lines = block.split('\n');
                const characterId = lines[0].replace(/\*\*/g, '');
                
                const injuries = lines.slice(1).map(line => {
                    const injuryMatch = line.match(/- (.*?) \((.*?)\)/);
                    if (injuryMatch) {
                        return {
                            id: Date.now() + Math.random(),
                            description: injuryMatch[1],
                            severity: injuryMatch[2]
                        };
                    }
                    return null;
                }).filter(Boolean);
                
                if (injuries.length > 0) {
                    this.injuries.set(characterId, injuries);
                }
            });
            
            // Parse psychological state
            const stateName = match[2];
            for (const [key, state] of Object.entries(extensionSettings.injurySystem.psychologicalStates)) {
                if (state.name === stateName) {
                    this.psychologicalState = key;
                    break;
                }
            }
            
            return true;
        }
        
        return false;
    }
} 