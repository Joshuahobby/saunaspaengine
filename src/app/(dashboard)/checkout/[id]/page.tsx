"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface CartItem {
    id: string;
    type: string;
    name: string;
    description: string;
    price: number;
    qty: number;
    icon?: string;
    bgColor?: string;
    textColor?: string;
    image?: string;
    badge?: string;
}

interface ProductItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    badge?: string;
}

const PAYMENT_MODE_MAP: Record<string, string> = {
    cash: "CASH",
    momo: "MOMO",
    pos: "CARD",
};

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [clientName, setClientName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const [selectedPaymentMode, setSelectedPaymentMode] = useState("cash");
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/checkout/details?id=${id}`);
                if (!res.ok) throw new Error("Failed to fetch checkout details");
                const data = await res.json();
                
                setClientName(data.clientName);
                
                const items: CartItem[] = data.services.map((s: { 
                    id: string; 
                    serviceName: string; 
                    isExtra: boolean; 
                    employeeName: string | null; 
                    amount: number; 
                }) => ({
                    id: s.id,
                    type: "service",
                    name: s.serviceName,
                    description: `${s.isExtra ? "Additional Service" : "Primary Service"} • Attendant: ${s.employeeName || "Unassigned"}`,
                    price: s.amount,
                    qty: 1,
                    icon: s.isExtra ? "add_circle" : "hot_tub",
                    bgColor: s.isExtra ? "bg-amber-100 dark:bg-amber-900/30" : "bg-teal-100 dark:bg-teal-900/30",
                    textColor: s.isExtra ? "text-amber-600 dark:text-amber-400" : "text-teal-600 dark:text-teal-400"
                }));
                
                setCartItems(items);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const suggestedItems = [
        {
            id: "s1",
            name: "Luxury Cotton Robe",
            description: "Plush, 100% Organic Cotton",
            price: 85.00,
            image: "https://images.unsplash.com/photo-1584949514120-c2d131ec41e3?auto=format&fit=crop&q=80&w=200&h=200",
            badge: "BEST SELLER"
        },
        {
            id: "s2",
            name: "Herbal Recovery Tea",
            description: "Post-sauna detox blend",
            price: 18.50,
            image: "https://images.unsplash.com/photo-1576092762791-dd9e2220c476?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            id: "s3",
            name: "Eucalyptus Shower Spray",
            description: "Natural aromatherapy mist",
            price: 24.00,
            image: "https://images.unsplash.com/photo-1615397323141-948f21975e54?auto=format&fit=crop&q=80&w=200&h=200"
        }
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const serviceTax = 9.60;
    const retailTax = 1.75;
    const total = subtotal + serviceTax + retailTax;

    const handleRemoveItem = (idToRemove: string) => {
        setCartItems(cartItems.filter(item => item.id !== idToRemove));
    };

    const handleCompletePayment = async () => {
        if (isCompleting || isCompleted) return;
        setIsCompleting(true);
        setError(null);
        try {
            const res = await fetch("/api/operations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    status: "COMPLETED",
                    paymentMode: PAYMENT_MODE_MAP[selectedPaymentMode] ?? "CASH",
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to complete payment");
            }
            setIsCompleted(true);
            setTimeout(() => router.push("/operations"), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete payment");
            setIsCompleting(false);
        }
    };

    const handleAddItem = (item: ProductItem) => {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCartItems(cartItems.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
            ));
        } else {
            setCartItems([...cartItems, { ...item, type: "retail", qty: 1 }]);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] animate-pulse italic">Calculating Total...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-8">
            <div className="bg-[var(--bg-card)] border border-red-500/20 rounded-2xl p-12 max-w-md text-center shadow-2xl">
                <span className="material-symbols-outlined text-5xl text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">error</span>
                <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em] mb-3">Checkout Error</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider leading-relaxed mb-8">{error}</p>
                <Link href="/operations" className="inline-flex py-4 px-10 rounded-xl bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                    Return to Operations
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Central Content: Checkout Area */}
            <section className="flex-1 flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.15em]">
                        <Link href="/operations" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Operations
                        </Link>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span className="text-[var(--text-main)] italic">Session #{id?.slice(-4)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-4xl font-display font-black text-[var(--text-main)] tracking-tighter italic">Unified <span className="text-[var(--color-primary)]">Checkout</span></h2>
                            <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mt-1 opacity-70">Guest Identity: <span className="text-[var(--text-main)]">{clientName}</span></p>
                        </div>
                        <div className="bg-[var(--color-primary)]/10 px-4 py-2 rounded-lg border border-[var(--color-primary)]/20">
                            <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">{cartItems.length} Item{cartItems.length !== 1 ? 's' : ''} Collected</span>
                        </div>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="glass-card border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Current Order</span>
                        <button className="text-[var(--color-primary)] text-sm font-bold flex items-center gap-1 hover:underline">
                            <span className="material-symbols-outlined text-sm">add</span> Add Custom Item
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {cartItems.map((item) => (
                            <div key={item.id} className={`p-6 flex items-center gap-4 ${item.type === "retail" ? "bg-[rgba(19,236,164,0.05)]" : ""}`}>
                                {item.type === "service" ? (
                                    <div className={`size-16 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0`}>
                                        <span className={`material-symbols-outlined ${item.textColor} text-3xl`}>{item.icon}</span>
                                    </div>
                                ) : (
                                    <div className="size-16 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-[var(--color-primary)]/20 overflow-hidden relative">
                                        {item.image && !failedImages.has(item.id) ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                onError={() => setFailedImages(prev => new Set(prev).add(item.id))}
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-2xl text-slate-400 dark:text-slate-600">shopping_bag</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-slate-900 dark:text-white font-bold">{item.name}</h4>
                                        {item.badge && (
                                            <span className="text-[10px] bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-1.5 py-0.5 rounded font-bold uppercase">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{item.description}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-slate-900 dark:text-white font-bold">RWF {(item.price * 1000).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">Qty: {item.qty}</p>
                                </div>

                                <button onClick={() => handleRemoveItem(item.id)} className="p-2 ml-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))}

                        {cartItems.length === 0 && (
                            <div className="p-10 text-center text-slate-500 font-medium">
                                The cart is currently empty.
                            </div>
                        )}
                    </div>

                    {/* Summary Area */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/40">
                        <div className="space-y-3 max-w-sm ml-auto">
                            <div className="flex justify-between text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm">
                                <span>Subtotal</span>
                                <span className="font-medium">RWF {(subtotal * 1000).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm">
                                <span>Service Tax (8%)</span>
                                <span className="font-medium">RWF {(serviceTax * 1000).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm">
                                <span>Retail Tax (5%)</span>
                                <span className="font-medium">RWF {(retailTax * 1000).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                                <span className="text-lg font-bold text-slate-900 dark:text-white uppercase">Total Due</span>
                                <span className="text-2xl font-black text-[var(--color-primary)]">RWF {(total * 1000).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="pt-6 space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 italic opacity-60">Payment Method</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'cash', label: 'Cash', icon: 'payments' },
                                        { id: 'momo', label: 'MoMo', icon: 'smartphone' },
                                        { id: 'pos', label: 'POS / Card', icon: 'point_of_sale' }
                                    ].map((pm) => (
                                        <label key={pm.id} className="cursor-pointer group">
                                            <input type="radio" name="paymentOption" value={pm.id} checked={selectedPaymentMode === pm.id} onChange={() => setSelectedPaymentMode(pm.id)} className="sr-only peer" />
                                            <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/[0.05] transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <span className="material-symbols-outlined text-slate-400 peer-checked:text-[var(--color-primary)]">{pm.icon}</span>
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 peer-checked:text-white">{pm.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={handleCompletePayment}
                                    disabled={isCompleting || isCompleted || cartItems.length === 0}
                                    className="w-full bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-bg-dark)] font-black py-4 rounded-xl shadow-[0_4px_0_0_rgba(17,212,196,0.3)] hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                                >
                                    {isCompleted ? (
                                        <>PAYMENT COMPLETE <span className="material-symbols-outlined">check_circle</span></>
                                    ) : isCompleting ? (
                                        <>Processing... <span className="material-symbols-outlined animate-spin">progress_activity</span></>
                                    ) : (
                                        <>COMPLETE PAYMENT <span className="material-symbols-outlined">arrow_forward</span></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Right Sidebar: Recommended Retail */}
            <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                <div className="glass-card p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">stars</span>
                        <h3 className="text-slate-900 dark:text-white font-bold">Recommended for Guest</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {suggestedItems.map((product) => (
                            <div key={product.id} className="group border border-slate-100 dark:border-slate-800 rounded-xl p-3 hover:border-[var(--color-primary)]/50 transition-colors glass-card">
                                <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 mb-3 relative overflow-hidden flex items-center justify-center">
                                    {product.image && !failedImages.has(product.id) ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={() => setFailedImages(prev => new Set(prev).add(product.id))}
                                        />
                                    ) : (
                                        <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600">shopping_bag</span>
                                    )}
                                    {product.badge && (
                                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded text-[10px] font-black text-slate-900 dark:text-white shadow-sm">
                                            {product.badge}
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{product.name}</h4>
                                <p className="text-slate-500 text-xs mb-3 mt-0.5 line-clamp-1">{product.description}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-slate-900 dark:text-white font-black text-base tracking-tight">RWF {(product.price * 1000).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    <button onClick={() => handleAddItem(product)} className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] text-[var(--color-primary)] p-2 rounded-lg transition-all border border-[var(--color-primary)]/20">
                                        <span className="material-symbols-outlined text-sm font-bold">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-5 py-2 text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-[var(--color-primary)] transition-colors border-t border-slate-100 dark:border-slate-800 pt-5">
                        View All Products
                    </button>
                </div>

                {/* Membership Promo */}
                <div className="bg-gradient-to-br from-[#102220] to-[#0a1514] rounded-xl p-6 border border-[var(--color-primary)]/30 relative overflow-hidden group shadow-lg">
                    <div className="relative z-10">
                        <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest">Upgrade Available</span>
                        <h4 className="text-white font-bold mt-2 text-lg">Diamond Membership</h4>
                        <p className="text-slate-300 text-xs mt-2 leading-relaxed opacity-90">Save 15% on today&apos;s session and all future retail purchases.</p>

                        <button className="mt-5 w-full bg-white text-slate-900 px-4 py-3 rounded-lg text-sm font-bold hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center">
                            UPGRADE +RWF 49,000/mo
                        </button>
                    </div>

                    <div className="absolute -right-6 -bottom-6 opacity-10 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                        <span className="material-symbols-outlined text-8xl text-white">diamond</span>
                    </div>
                </div>
            </aside>
        </div>
    );
}
