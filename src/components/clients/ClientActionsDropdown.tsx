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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isArchived = status === "ARCHIVED";

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
        setActionError(null);
        const newStatus = isArchived ? "ACTIVE" : "ARCHIVED";
        const res = await updateClientStatus(clientId, newStatus);
        if (res.error) setActionError(res.error);
        setIsProcessing(false);
        setIsOpen(false);
    }

    async function handleDelete() {
        setShowDeleteConfirm(false);
        setIsProcessing(true);
        setActionError(null);
        const res = await deleteClient(clientId);
        if (res.error) setActionError(res.error);
        setIsProcessing(false);
    }

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    title="More Actions"
                    aria-label="More Actions"
                    className="size-10 flex items-center justify-center rounded-xl bg-[var(--bg-surface-muted)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] transition-all border border-[var(--border-muted)]"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-surface border border-[var(--border-main)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        {actionError && (
                            <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20">
                                <p className="text-[10px] font-bold text-red-500">{actionError}</p>
                            </div>
                        )}
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
                                type="button"
                                disabled={isProcessing}
                                onClick={handleArchive}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--text-main)] hover:bg-amber-500/10 hover:text-amber-500 rounded-xl transition-all"
                            >
                                {isArchived ? <RefreshCw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                                {isArchived ? "Restore Client" : "Archive Client"}
                            </button>
                            <div className="h-px bg-[var(--border-muted)]/30 my-1 mx-2"></div>
                            <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => { setShowDeleteConfirm(true); setIsOpen(false); }}
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

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Delete Record</h3>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-[var(--text-main)] px-1">
                            Permanently delete <span className="text-red-500">{clientName}</span>? All history and memberships will be removed.
                        </p>
                        {actionError && (
                            <p className="text-[10px] font-bold text-red-500 px-4 py-2 bg-red-500/10 rounded-xl">{actionError}</p>
                        )}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 h-12 rounded-2xl border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isProcessing}
                                className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                            >
                                {isProcessing ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
