const agents = [
    'web-server-01', 'db-server-02', 'win-dc-01', 'linux-host-03',
    'workstation-04', 'firewall-01', 'mail-server-01', 'api-gateway-02',
];
const ruleDescriptions = [
    { id: '5710', level: 5, desc: 'sshd: Attempt to login using a non-existent user', groups: ['syslog', 'sshd', 'authentication_failed'] },
    { id: '5716', level: 10, desc: 'sshd: Multiple authentication failures', groups: ['syslog', 'sshd', 'authentication_failures'], mitre: { id: ['T1110'], tactic: ['Credential Access'], technique: ['Brute Force'] } },
    { id: '5720', level: 10, desc: 'sshd: Multiple authentication failures (possible brute force)', groups: ['syslog', 'sshd', 'authentication_failures'], mitre: { id: ['T1110.001'], tactic: ['Credential Access'], technique: ['Password Guessing'] } },
    { id: '18107', level: 7, desc: 'Malware detection - Trojan/Malware detected by antivirus', groups: ['malware'], mitre: { id: ['T1059'], tactic: ['Execution'], technique: ['Command and Scripting Interpreter'] } },
    { id: '92200', level: 12, desc: 'PowerShell suspicious command detected', groups: ['windows', 'powershell'], mitre: { id: ['T1059.001'], tactic: ['Execution'], technique: ['PowerShell'] } },
    { id: '62002', level: 9, desc: 'Windows: Scheduled task created', groups: ['windows', 'persistence'], mitre: { id: ['T1053.005'], tactic: ['Persistence'], technique: ['Scheduled Task'] } },
    { id: '100100', level: 14, desc: 'Ransomware-like behavior: Mass file encryption detected', groups: ['ransomware'], mitre: { id: ['T1486'], tactic: ['Impact'], technique: ['Data Encrypted for Impact'] } },
    { id: '31103', level: 6, desc: 'Web attack: XSS attempt detected', groups: ['web', 'attack'], mitre: { id: ['T1059.007'], tactic: ['Execution'], technique: ['JavaScript'] } },
    { id: '40101', level: 8, desc: 'Network: Port scan detected', groups: ['network', 'scan'], mitre: { id: ['T1046'], tactic: ['Discovery'], technique: ['Network Service Discovery'] } },
    { id: '5501', level: 3, desc: 'Login session opened for user root', groups: ['syslog', 'su'] },
    { id: '5502', level: 3, desc: 'User added to group', groups: ['syslog', 'useradd'] },
    { id: '80790', level: 12, desc: 'Possible credential dumping via LSASS', groups: ['windows'], mitre: { id: ['T1003.001'], tactic: ['Credential Access'], technique: ['LSASS Memory'] } },
    { id: '87105', level: 11, desc: 'Lateral movement: PsExec execution detected', groups: ['windows', 'lateral'], mitre: { id: ['T1570'], tactic: ['Lateral Movement'], technique: ['Lateral Tool Transfer'] } },
];
function randomDate(hoursAgo = 24) {
    const now = new Date();
    const past = new Date(now.getTime() - Math.random() * hoursAgo * 3600000);
    return past.toISOString();
}
function randomIp() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}
export function generateMockAlerts(count = 200) {
    return Array.from({ length: count }, (_, i) => {
        const rule = ruleDescriptions[Math.floor(Math.random() * ruleDescriptions.length)];
        const agentName = agents[Math.floor(Math.random() * agents.length)];
        return {
            id: `alert-${i + 1}`,
            timestamp: randomDate(48),
            rule: {
                id: rule.id,
                level: rule.level,
                description: rule.desc,
                groups: rule.groups,
                mitre: rule.mitre,
            },
            agent: {
                id: String(Math.floor(Math.random() * 10)).padStart(3, '0'),
                name: agentName,
                ip: randomIp(),
            },
            manager: { name: 'wazuh-manager' },
            data: {
                srcip: randomIp(),
                dstip: randomIp(),
                srcport: Math.floor(Math.random() * 65535),
                dstport: [22, 80, 443, 3389, 5985][Math.floor(Math.random() * 5)],
                user: ['root', 'admin', 'administrator', 'user1', 'john'][Math.floor(Math.random() * 5)],
            },
            full_log: `${new Date().toISOString()} ${agentName} rule[${rule.id}] ${rule.desc}`,
            location: '/var/log/syslog',
        };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
export function generateMockAgents() {
    const platforms = ['linux', 'windows', 'darwin'];
    const osNames = {
        linux: ['Ubuntu 22.04', 'CentOS 8', 'Debian 11', 'RHEL 9'],
        windows: ['Windows Server 2022', 'Windows 10', 'Windows 11', 'Windows Server 2019'],
        darwin: ['macOS Ventura', 'macOS Monterey'],
    };
    const statuses = ['active', 'active', 'active', 'active', 'disconnected', 'pending'];
    return agents.map((name, i) => {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const osName = osNames[platform][Math.floor(Math.random() * osNames[platform].length)];
        return {
            id: String(i + 1).padStart(3, '0'),
            name,
            ip: `10.0.0.${i + 10}`,
            os: {
                name: osName,
                version: osName,
                platform,
            },
            status: statuses[Math.floor(Math.random() * statuses.length)],
            version: 'Wazuh v4.8.0',
            lastKeepAlive: randomDate(2),
            registerIP: `10.0.0.${i + 10}`,
            group: ['default', 'linux-servers', 'windows-workstations'][Math.floor(Math.random() * 3)].split(','),
        };
    });
}
export function generateMockIncidents() {
    return [
        {
            id: 'INC-001',
            title: 'SSH Brute Force Attack Campaign',
            description: 'Multiple SSH brute force attempts detected from external IPs targeting production servers.',
            severity: 'high',
            status: 'investigating',
            assignee: 'alice@soc.local',
            createdAt: randomDate(12),
            updatedAt: randomDate(1),
            alerts: ['alert-1', 'alert-2', 'alert-3'],
            mitreTactics: ['Credential Access', 'Initial Access'],
            aiSummary: 'This incident involves a coordinated SSH brute force campaign targeting multiple production servers. The attack originated from multiple IP ranges suggesting a distributed attack infrastructure. Immediate containment recommended via IP blocking at the firewall level.',
            timeline: [
                { id: 'evt-1', timestamp: randomDate(12), type: 'alert', description: 'First SSH failure detected on web-server-01' },
                { id: 'evt-2', timestamp: randomDate(10), type: 'alert', description: 'Multiple failures detected across 3 agents' },
                { id: 'evt-3', timestamp: randomDate(8), type: 'action', description: 'Alert escalated to Tier 2 analyst', actor: 'system' },
                { id: 'evt-4', timestamp: randomDate(6), type: 'note', description: 'IPs added to blocklist: 192.168.x.x range', actor: 'alice@soc.local' },
            ],
        },
        {
            id: 'INC-002',
            title: 'Ransomware Detection on Win-DC-01',
            description: 'Mass file encryption behavior detected on Windows domain controller.',
            severity: 'critical',
            status: 'contained',
            assignee: 'bob@soc.local',
            createdAt: randomDate(6),
            updatedAt: randomDate(0.5),
            alerts: ['alert-10', 'alert-11'],
            mitreTactics: ['Impact', 'Execution'],
            aiSummary: 'Critical ransomware activity detected on the primary domain controller. The malware appears to be LockBit variant based on encryption pattern and ransom note format. System has been isolated from network. Recovery from last known good backup recommended.',
            timeline: [
                { id: 'evt-1', timestamp: randomDate(6), type: 'alert', description: 'Mass file encryption detected (Rule 100100)' },
                { id: 'evt-2', timestamp: randomDate(5.5), type: 'escalation', description: 'Escalated to Critical - SOC manager notified' },
                { id: 'evt-3', timestamp: randomDate(5), type: 'action', description: 'Host isolated from network', actor: 'bob@soc.local' },
            ],
        },
        {
            id: 'INC-003',
            title: 'Suspicious PowerShell Execution',
            description: 'Encoded PowerShell commands executed on multiple workstations.',
            severity: 'medium',
            status: 'open',
            createdAt: randomDate(3),
            updatedAt: randomDate(1),
            alerts: ['alert-20'],
            mitreTactics: ['Execution', 'Defense Evasion'],
            timeline: [
                { id: 'evt-1', timestamp: randomDate(3), type: 'alert', description: 'PowerShell rule 92200 triggered on workstation-04' },
            ],
        },
    ];
}
export function generateDashboardStats() {
    return {
        totalAlerts: 1247,
        criticalAlerts: 23,
        highAlerts: 89,
        activeAgents: 6,
        totalAgents: 8,
        failedLogins: 342,
        malwareDetections: 7,
        openIncidents: 3,
    };
}
export const MOCK_ALERTS = generateMockAlerts(300);
export const MOCK_AGENTS = generateMockAgents();
export const MOCK_INCIDENTS = generateMockIncidents();
export const MOCK_STATS = generateDashboardStats();
