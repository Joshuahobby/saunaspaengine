"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, Edit, Archive, Trash2, User, RefreshCw, AlertTriangle } from "lucide-react";
import { updateClientStatus, deleteClient } from "@/app/(dashboard)/clients/actions";

interface ClientActionsDropdownProps {
    clientId: string;
    clientName: string;
    status: string;
}

export default function ClientActionsDropdown({ clientId, clientName, status }: ClientActionsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isArchived = status === "ARCHIVED";

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleArchive() {
        setIsProcessing(true);
        const newStatus = isArchived ? "ACTIVE" : "ARCHIVED";
        const res = await updateClientStatus(clientId, newStatus);
        if (res.error) alert(res.error);
        setIsProcessing(false);
        setIsOpen(false);
    }

    async function handleDelete() {
        if (!confirm(`Are you sure you want to permanently delete ${clientName}? This will remove all their history and memberships.`)) return;
        
        setIsProcessing(true);
        const res = await deleteClient(clientId);
        if (res.error) alert(res.error);
        setIsProcessing(false);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                title="More Actions"
                aria-label="More Actions"
                className="size-10 flex items-center justify-center rounded-xl bg-[var(--bg-surface-muted)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] transition-all border border-[var(--border-muted)]"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-surface border border-[var(--border-main)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-2 space-y-1">
                        <Link 
                            href={`/clients/${clientId}`}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--text-main)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] rounded-xl transition-all"
                        >
                            <User className="w-4 h-4" /> View Profile
                        </Link>
                        <Link 
                            href={`/clients/${clientId}/edit`}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--text-main)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] rounded-xl transition-all"
                        >
                            <Edit className="w-4 h-4" /> Edit Details
                        </Link>
                        <button 
                            disabled={isProcessing}
                            onClick={handleArchive}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--text-main)] hover:bg-amber-500/10 hover:text-amber-500 rounded-xl transition-all"
                        >
                            {isArchived ? <RefreshCw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                            {isArchived ? "Restore Client" : "Archive Client"}
                        </button>
                        <div className="h-px bg-[var(--border-muted)]/30 my-1 mx-2"></div>
                        <button 
                            disabled={isProcessing}
                            onClick={handleDelete}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Record
                        </button>
                    </div>
                    {isArchived && (
                        <div className="bg-amber-500/10 p-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Client is currently archived</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
