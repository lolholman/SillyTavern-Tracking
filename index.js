import { eventSource, event_types } from "../../../../script.js";
import { extension_settings } from "../../../../../../scripts/extensions.js";
import { SlashCommand } from "../../../slash-commands/SlashCommand.js";
import { SlashCommandParser } from "../../../slash-commands/SlashCommandParser.js";
import { ARGUMENT_TYPE, SlashCommandNamedArgument } from "../../../slash-commands/SlashCommandArgument.js";
import { commonEnumProviders } from "../../../slash-commands/SlashCommandCommonEnumsProvider.js";
import { SlashCommandEnumValue } from "../../../slash-commands/SlashCommandEnumValue.js";

import { initSettings } from "./src/settings/settings.js";
import { eventHandlers } from "./src/events.js";
import { InjurySystemHandler } from "./src/injurySystemHandler.js";
import { saveTracker } from "./src/trackerDataHandler.js";

export const extensionName = "InjuryTracker";
const extensionNameLong = `SillyTavern-${extensionName}`;
export const extensionFolderPath = `scripts/extensions/third-party/${extensionNameLong}`;

if (!extension_settings[extensionName.toLowerCase()]) extension_settings[extensionName.toLowerCase()] = {};
export const extensionSettings = extension_settings[extensionName.toLowerCase()];

jQuery(async () => {
	await initSettings();
});

// Register event handlers
eventSource.on(event_types.CHAT_CHANGED, eventHandlers.onChatChanged);
eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, eventHandlers.onCharacterMessageRendered);
eventSource.on(event_types.USER_MESSAGE_RENDERED, eventHandlers.onUserMessageRendered);
eventSource.on(event_types.MESSAGE_RECEIVED, eventHandlers.onMessageReceived);
eventSource.on(event_types.MESSAGE_SENT, eventHandlers.onMessageSent);

// Add slash commands for injury tracking
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
	name: 'get-injuries',
	callback: async (args) => {
		const messageId = args.message ? parseInt(args.message) : null;
		const lastMessageWithTracker = messageId || getLastMessageWithTracker();
		const tracker = chat[lastMessageWithTracker]?.tracker || {};
		return JSON.stringify(tracker.PhysicalInjuries || [], null, 2);
	},
	returns: 'The current injuries JSON object.',
	namedArgumentList: [
		SlashCommandNamedArgument.fromProps({
			name: 'message',
			description: 'message to retrieve injuries from',
			typeList: [ARGUMENT_TYPE.NUMBER],
			isRequired: false,
			enumProvider: commonEnumProviders.messages(),
		}),
	],
	helpString: 'Retrieves the injuries from the specified message. If no message is provided, the injuries will be retrieved from the last message with a tracker.',
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
	name: 'get-psychological-state',
	callback: async (args) => {
		const messageId = args.message ? parseInt(args.message) : null;
		const lastMessageWithTracker = messageId || getLastMessageWithTracker();
		const tracker = chat[lastMessageWithTracker]?.tracker || {};
		return JSON.stringify(tracker.PsychologicalState || {}, null, 2);
	},
	returns: 'The current psychological state JSON object.',
	namedArgumentList: [
		SlashCommandNamedArgument.fromProps({
			name: 'message',
			description: 'message to retrieve psychological state from',
			typeList: [ARGUMENT_TYPE.NUMBER],
			isRequired: false,
			enumProvider: commonEnumProviders.messages(),
		}),
	],
	helpString: 'Retrieves the psychological state from the specified message. If no message is provided, the psychological state will be retrieved from the last message with a tracker.',
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
	name: 'injury-tracker-state',
	callback: async (args) => {
		if (args.enabled !== undefined) {
			extensionSettings.injurySystem.enabled = args.enabled;
			return `Injury tracker ${args.enabled ? 'enabled' : 'disabled'}.`;
		}
		return `Injury tracker is ${extensionSettings.injurySystem.enabled ? 'enabled' : 'disabled'}.`;
	},
	returns: 'The current injury tracker state.',
	namedArgumentList: [
		SlashCommandNamedArgument.fromProps({
			name: 'enabled',
			description: 'whether to enable or disable the injury tracker',
			typeList: [ARGUMENT_TYPE.BOOLEAN],
			isRequired: false,
		}),
	],
	helpString: 'Get or set the injury tracker enabled/disabled state.',
	aliases: ['toggle-injury-tracker'],
}));

// Helper function to get the last message with a tracker
function getLastMessageWithTracker() {
	for (let i = chat.length - 1; i >= 0; i--) {
		if (chat[i]?.tracker && Object.keys(chat[i].tracker).length > 0) {
			return i;
		}
	}
	return null;
}