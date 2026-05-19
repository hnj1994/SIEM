const OLLAMA_BASE = '/api/ollama';
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SOC_SYSTEM_PROMPT = `You are SOC Nexus AI, an expert cybersecurity analyst and SIEM assistant.
You analyze security alerts, investigate incidents, and help SOC analysts respond to threats.
You have deep knowledge of:
- MITRE ATT&CK framework
- Wazuh SIEM alerts and rules
- Threat hunting techniques
- Incident response procedures
- Malware analysis
- Network security

When analyzing alerts, provide:
1. Severity assessment
2. Attack technique identification (MITRE)
3. Recommended immediate actions
4. Investigation steps
5. Long-term remediation

Be concise, technical, and actionable. Format responses with clear sections.`;

export async function* streamOllamaChat(
  messages: OllamaMessage[],
  signal?: AbortSignal
): AsyncGenerator<string> {
  const fullMessages = [
    { role: 'system', content: SOC_SYSTEM_PROMPT },
    ...messages,
  ];

  const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: fullMessages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.message?.content) {
          yield parsed.message.content;
        }
      } catch {
        // Skip malformed lines
      }
    }
  }
}

export async function explainAlert(alertJson: string): Promise<string> {
  const messages: OllamaMessage[] = [
    {
      role: 'user',
      content: `Analyze this Wazuh security alert and provide a detailed explanation:\n\n${alertJson}\n\nProvide: 1) What happened, 2) Severity assessment, 3) MITRE ATT&CK mapping, 4) Immediate actions required.`,
    },
  ];

  let result = '';
  for await (const chunk of streamOllamaChat(messages)) {
    result += chunk;
  }
  return result;
}

export async function generateIncidentSummary(incidentData: string): Promise<string> {
  const messages: OllamaMessage[] = [
    {
      role: 'user',
      content: `Generate a professional incident summary report for the following security incident data:\n\n${incidentData}\n\nInclude: Executive Summary, Timeline, Impact Assessment, Root Cause, and Remediation Steps.`,
    },
  ];

  let result = '';
  for await (const chunk of streamOllamaChat(messages)) {
    result += chunk;
  }
  return result;
}

export async function translateToQuery(naturalLanguage: string): Promise<string> {
  const messages: OllamaMessage[] = [
    {
      role: 'user',
      content: `Translate this natural language query into a Wazuh API query string (q parameter format):\n\nQuery: "${naturalLanguage}"\n\nReturn ONLY the query string, nothing else. Example format: rule.level>=10 AND agent.name=web-server`,
    },
  ];

  let result = '';
  for await (const chunk of streamOllamaChat(messages)) {
    result += chunk;
  }
  return result.trim();
}

export async function getOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE}/api/tags`);
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [MODEL];
  }
}
