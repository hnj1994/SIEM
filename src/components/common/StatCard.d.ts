import { ReactNode } from 'react';
interface Props {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    color?: string;
    trend?: {
        value: number;
        label: string;
    };
    glow?: boolean;
}
export default function StatCard({ title, value, subtitle, icon, color, trend, glow }: Props): import("react/jsx-runtime").JSX.Element;
export {};
