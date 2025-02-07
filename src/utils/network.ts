export interface NetworkInformation extends EventTarget {
    readonly effectiveType: string;
    readonly type: string;
    readonly downlink: number;
    readonly downlinkMax?: number;
    readonly rtt: number;
    readonly saveData: boolean;
    onchange: ((this: NetworkInformation, ev: Event) => any) | null;
}

declare global {
    interface Navigator {
        connection?: NetworkInformation;
    }
}