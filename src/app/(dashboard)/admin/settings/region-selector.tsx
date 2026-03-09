"use client";

import { useRouter } from "next/navigation";

export default function RegionSelector({
    activeRegion,
    regions,
}: {
    activeRegion: string;
    regions: string[];
}) {
    const router = useRouter();

    return (
        <select
            aria-label="Select Global Region"
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm font-semibold focus:ring-[var(--color-primary)] py-1.5 pl-4 pr-10 text-slate-900 dark:text-white outline-none cursor-pointer"
            value={activeRegion}
            onChange={(e) => router.push(`?region=${encodeURIComponent(e.target.value)}`)}
        >
            {regions.map((region) => (
                <option key={region} value={region}>
                    {region}
                </option>
            ))}
        </select>
    );
}
