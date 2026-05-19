export interface OllamaMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare function streamOllamaChat(messages: OllamaMessage[], signal?: AbortSignal): AsyncGenerator<string>;
export declare function explainAlert(alertJson: string): Promise<string>;
export declare function generateIncidentSummary(incidentData: string): Promise<string>;
export declare function translateToQuery(naturalLanguage: string): Promise<string>;
export declare function getOllamaModels(): Promise<string[]>;
