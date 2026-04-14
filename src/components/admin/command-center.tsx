"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchResult {
    businesses: Array<{ id: string; name: string; ownerEmail: string; status: string }>;
    branches: Array<{ id: string; name: string; businessId: string; status: string }>;
    clients: Array<{ id: string; fullName: string; phone: string; qrCode: string; branch: { name: string } }>;
}

export function CommandCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Flatten results for keyboard navigation
    const flatResults = [
        ...(results?.businesses.map(b => ({ ...b, type: "business" })) || []),
        ...(results?.branches.map(b => ({ ...b, type: "branch" })) || []),
        ...(results?.clients.map(c => ({ ...c, type: "client" })) || []),
    ];

    const toggle = useCallback(() => setIsOpen(open => !open), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                toggle();
            }
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggle]);

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
                setActiveIndex(0);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery("");
        }
    }, [isOpen]);

    const handleSelect = (item: { id: string; type: string }) => {
        setIsOpen(false);
        if (item.type === "business") router.push(`/businesses/${item.id}`);
        else if (item.type === "branch") router.push(`/branches`); 
        else if (item.type === "client") router.push(`/members`); 
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % flatResults.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (flatResults[activeIndex]) {
                handleSelect(flatResults[activeIndex] as { id: string; type: string });
            }
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button 
                onClick={toggle}
                className="relative hidden md:flex items-center gap-3 pl-4 pr-3 py-2 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl text-[10px] font-bold text-[var(--text-muted)] hover:border-[var(--color-primary)] transition-all group w-72"
            >
                <span className="material-symbols-outlined text-[18px] opacity-60 group-hover:opacity-100 transition-opacity">search</span>
                <span className="flex-1 text-left opacity-60 group-hover:opacity-100 transition-opacity">Command Center...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[9px] font-black opacity-60 group-hover:opacity-90 transition-opacity text-[var(--text-muted)]">
                    {navigator?.platform?.toUpperCase().indexOf('MAC') >= 0 ? '⌘K' : 'Ctrl+K'}
                </kbd>
            </button>

            {/* Mobile Icon */}
            <button 
                onClick={toggle}
                className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Search"
            >
                <span className="material-symbols-outlined">search</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-[var(--bg-app)]/80 backdrop-blur-md"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="p-4 border-b border-[var(--border-muted)] flex items-center gap-4">
                                <span className={`material-symbols-outlined text-[var(--color-primary)] ${isLoading ? 'animate-spin' : ''}`}>
                                    {isLoading ? 'sync' : 'search'}
                                </span>
                                <input 
                                    ref={inputRef}
                                    value={query}
                                    onKeyDown={onKeyDown}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Type to find businesses, branches, or clients..."
                                    className="flex-1 bg-transparent border-none outline-none text-[var(--text-main)] font-bold placeholder:text-[var(--text-muted)]/40 text-base py-2"
                                />
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="px-2 py-1 rounded bg-[var(--bg-surface-muted)] text-[8px] font-black uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors border border-[var(--border-muted)]"
                                >
                                    Esc
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto">
                                {!query && (
                                    <div className="p-8 text-center space-y-4 opacity-70">
                                        <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">travel_explore</span>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]">Global Command Center</p>
                                        <p className="text-[9px] font-medium max-w-xs mx-auto text-[var(--text-muted)]">Start typing to search your resources. Find anything in seconds.</p>
                                    </div>
                                )}

                                {query && !isLoading && flatResults.length === 0 && (
                                    <div className="p-12 text-center opacity-60">
                                        <p className="text-sm font-bold italic text-[var(--text-muted)]">No results found for &quot;{query}&quot;</p>
                                    </div>
                                )}

                                <div className="p-2 space-y-4">
                                    <ResultSection title="Businesses" results={results?.businesses} activeIndex={activeIndex} offset={0} onSelect={handleSelect} router={router} />
                                    <ResultSection title="Branches" results={results?.branches} activeIndex={activeIndex} offset={results?.businesses.length || 0} onSelect={handleSelect} router={router} />
                                    <ResultSection title="Clients" results={results?.clients} activeIndex={activeIndex} offset={(results?.businesses.length || 0) + (results?.branches.length || 0)} onSelect={handleSelect} router={router} />
                                </div>
                            </div>

                            <div className="p-4 border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 opacity-60">
                                        <kbd className="px-1 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-muted)] text-[8px] text-[var(--text-muted)]">↑↓</kbd>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-60">
                                        <kbd className="px-1 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-muted)] text-[8px] text-[var(--text-muted)]">Enter</kbd>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Select</span>
                                    </div>
                                </div>
                                <div className="text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest opacity-60">
                                    Command Center V1.0
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

function ResultSection({ title, results, activeIndex, offset, onSelect }: { title: string; results?: Array<{ id: string; name?: string; fullName?: string; ownerEmail?: string; identifier?: string; branch?: { name: string } }>; activeIndex: number; offset: number; onSelect: (item: { id: string; type: string }) => void; router: any }) {
    if (!results || results.length === 0) return null;

    return (
        <div className="space-y-1">
            <h3 className="px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">{title}</h3>
            {results.map((item, idx: number) => {
                const isFocused = activeIndex === offset + idx;
                const type = title.toLowerCase().slice(0, -1);
                
                return (
                    <button
                        key={item.id}
                        onClick={() => onSelect({ ...item, type })}
                        className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between transition-all group ${isFocused ? 'bg-[var(--color-primary)] text-[var(--bg-app)]' : 'hover:bg-[var(--bg-surface-muted)] text-[var(--text-main)]'}`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`material-symbols-outlined text-lg ${isFocused ? 'text-[var(--bg-app)]' : 'text-[var(--text-muted)] group-hover:text-[var(--color-primary)]'}`}>
                                {type === "business" ? "corporate_fare" : type === "branch" ? "storefront" : "person"}
                            </span>
                            <div>
                                <p className="font-bold text-sm tracking-tight">{item.name || item.fullName}</p>
                                <p className={`text-[9px] font-medium opacity-70 ${isFocused ? 'text-[var(--bg-app)] opacity-90' : ''}`}>
                                    {item.ownerEmail || item.identifier || (item.branch ? `Branch: ${item.branch.name}` : item.id)}
                                </p>
                            </div>
                        </div>
                        <span className={`material-symbols-outlined text-sm opacity-0 group-hover:opacity-70 ${isFocused ? 'opacity-100 text-[var(--bg-app)]' : ''}`}>
                            chevron_right
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
