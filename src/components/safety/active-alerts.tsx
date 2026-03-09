"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";

interface SafetyAlert {
    id: string;
    type: "SILENT" | "CRITICAL";
    location: string | null;
    message: string | null;
    status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED";
    createdAt: string;
}

export default function ActiveAlerts() {
    const [alerts, setAlerts] = useState<SafetyAlert[]>([]);

    const fetchAlerts = useCallback(async () => {
        try {
            const res = await fetch("/api/safety/alerts");
            if (res.ok) {
                const data = await res.json();
                setAlerts(data);
            }
        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [fetchAlerts]);

    const acknowledgeAlert = async (id: string) => {
        try {
            const res = await fetch("/api/safety/alerts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: "ACKNOWLEDGED" }),
            });
            if (res.ok) fetchAlerts();
        } catch (error) {
            console.error("Failed to acknowledge alert:", error);
        }
    };

    const resolveAlert = async (id: string) => {
        try {
            const res = await fetch("/api/safety/alerts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: "RESOLVED" }),
            });
            if (res.ok) fetchAlerts();
        } catch (error) {
            console.error("Failed to resolve alert:", error);
        }
    };

    if (alerts.length === 0) return null;

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-600">
                <span className="material-symbols-outlined fill-1 animate-pulse">emergency</span>
                <span className="text-sm font-black uppercase tracking-tighter">Active Safety Alerts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-xl border flex flex-col gap-3 ${alert.type === 'CRITICAL' ? 'bg-rose-50 border-rose-200 shadow-lg shadow-rose-200/50' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${alert.type === 'CRITICAL' ? 'bg-rose-600 animate-ping' : 'bg-amber-500'}`}></span>
                                    {alert.location || "Unknown Location"}
                                </p>
                                <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(alert.createdAt))} ago</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${alert.type === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
                                {alert.type}
                            </span>
                        </div>
                        <p className="text-sm font-medium">{alert.message || "No message provided"}</p>
                        <div className="flex gap-2">
                            {alert.status === "PENDING" && (
                                <button
                                    onClick={() => acknowledgeAlert(alert.id)}
                                    className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Acknowledge
                                </button>
                            )}
                            <button
                                onClick={() => resolveAlert(alert.id)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${alert.type === 'CRITICAL' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                            >
                                Resolve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
