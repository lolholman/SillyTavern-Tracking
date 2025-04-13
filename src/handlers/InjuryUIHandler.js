import { extensionSettings } from '../settings/settings.js';

export class InjuryUIHandler {
    constructor(injurySystemHandler) {
        this.injurySystemHandler = injurySystemHandler;
        this.container = null;
        this.init();
    }

    init() {
        // Create main container
        this.container = document.createElement('div');
        this.container.id = 'injury-tracker-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 8px;
            color: white;
            font-family: Arial, sans-serif;
            max-width: 300px;
            z-index: 1000;
        `;

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Injury Tracker';
        title.style.margin = '0';

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeButton.onclick = () => this.container.style.display = 'none';

        header.appendChild(title);
        header.appendChild(closeButton);
        this.container.appendChild(header);

        // Create content area
        this.content = document.createElement('div');
        this.content.id = 'injury-tracker-content';
        this.container.appendChild(this.content);

        // Add to document
        document.body.appendChild(this.container);

        // Initial update
        this.updateDisplay();
    }

    updateDisplay() {
        if (!this.content) return;

        this.content.innerHTML = '';
        
        // Add injuries section
        const injuriesSection = document.createElement('div');
        injuriesSection.style.marginBottom = '15px';

        for (const [characterId, injuries] of this.injurySystemHandler.injuries) {
            if (injuries.length > 0) {
                const characterDiv = document.createElement('div');
                characterDiv.style.marginBottom = '10px';

                const characterName = document.createElement('strong');
                characterName.textContent = characterId;
                characterDiv.appendChild(characterName);

                const injuriesList = document.createElement('ul');
                injuriesList.style.margin = '5px 0';
                injuriesList.style.paddingLeft = '20px';

                injuries.forEach(injury => {
                    const li = document.createElement('li');
                    li.textContent = `${injury.description} (${injury.severity})`;
                    injuriesList.appendChild(li);
                });

                characterDiv.appendChild(injuriesList);
                injuriesSection.appendChild(characterDiv);
            }
        }

        this.content.appendChild(injuriesSection);

        // Add psychological state section
        const stateSection = document.createElement('div');
        const state = extensionSettings.injurySystem.psychologicalStates[this.injurySystemHandler.getPsychologicalState()];
        
        const stateTitle = document.createElement('strong');
        stateTitle.textContent = 'Psychological State: ';
        stateSection.appendChild(stateTitle);

        const stateName = document.createElement('span');
        stateName.textContent = state.name;
        stateSection.appendChild(stateName);

        const stateDesc = document.createElement('div');
        stateDesc.style.fontSize = '0.9em';
        stateDesc.style.fontStyle = 'italic';
        stateDesc.textContent = state.description;
        stateSection.appendChild(stateDesc);

        this.content.appendChild(stateSection);
    }

    show() {
        this.container.style.display = 'block';
        this.updateDisplay();
    }

    hide() {
        this.container.style.display = 'none';
    }

    toggle() {
        if (this.container.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }
} 