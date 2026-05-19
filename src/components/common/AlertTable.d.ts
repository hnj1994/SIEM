import { WazuhAlert } from '@/types';
interface Props {
    alerts: WazuhAlert[];
    compact?: boolean;
    limit?: number;
}
export default function AlertTable({ alerts, compact, limit }: Props): import("react/jsx-runtime").JSX.Element;
export {};
