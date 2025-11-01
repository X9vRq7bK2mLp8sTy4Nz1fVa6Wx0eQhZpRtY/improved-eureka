export interface ProtectionResult {
    entryPoint: string;
}

export const protectScript = async (script: string): Promise<ProtectionResult> => {
    const response = await fetch('/api/protect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to protect script on the server.');
    }

    return data;
};
