import React from "react";
import Link from "next/link";
import { CopyButton } from "./components/CopyButton";

export default function ApiReferencePage() {
    return (
        <div className="flex flex-col h-screen w-full bg-[#0a1118] text-slate-300 font-[Manrope,sans-serif] overflow-hidden selection:bg-primary/30 selection:text-white">
            {/* Header */}
            <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-[#0a1118]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <Link href="/developer" className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded flex items-center justify-center text-[#10221c]">
                            <span className="material-symbols-outlined font-bold text-lg">spa</span>
                        </div>
                        <h2 className="text-lg font-extrabold text-white tracking-tight">API Reference</h2>
                    </Link>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-md border border-slate-700/50">
                        <span className="text-xs font-medium text-slate-400">v2.4.0</span>
                        <span className="material-symbols-outlined text-slate-500 text-[16px]">expand_more</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center relative w-64">
                        <span className="material-symbols-outlined absolute left-3 text-slate-500 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search endpoints..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-12 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                        />
                        <div className="absolute right-2 flex gap-1">
                            <kbd className="hidden xl:inline-block bg-slate-800 border border-slate-700 rounded px-1.5 text-[10px] text-slate-500 font-sans shadow-sm">⌘</kbd>
                            <kbd className="hidden xl:inline-block bg-slate-800 border border-slate-700 rounded px-1.5 text-[10px] text-slate-500 font-sans shadow-sm">K</kbd>
                        </div>
                    </div>
                    <Link href="/developer" className="text-sm font-medium hover:text-white transition-colors">Documentation</Link>
                    <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-[#0a1118] bg-primary px-4 py-1.5 rounded-md hover:brightness-110 transition-all">
                        Get API Key
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane - Navigation */}
                <aside className="w-64 flex-shrink-0 border-r border-slate-800/60 bg-[#0c161f] overflow-y-auto hidden md:block hide-scrollbar">
                    <nav className="p-4 space-y-8">
                        {/* Getting Started */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Getting Started</h3>
                            <ul className="space-y-1">
                                <li>
                                    <Link href="#" className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md group transition-colors">
                                        <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-primary transition-colors">vpn_key</span>
                                        Authentication
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md group transition-colors">
                                        <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-primary transition-colors">error</span>
                                        Errors
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md group transition-colors">
                                        <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-primary transition-colors">dataset</span>
                                        Pagination
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Core Resources */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Core Resources</h3>
                            <ul className="space-y-4">
                                {/* Clients */}
                                <li>
                                    <div className="px-2 py-1 flex items-center justify-between text-sm font-bold text-slate-200 cursor-pointer group">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px] text-primary/80">person</span>
                                            Clients
                                        </div>
                                    </div>
                                    <ul className="mt-1 ml-6 space-y-1 border-l border-slate-800">
                                        <li>
                                            <Link href="#" className="block pl-4 py-1.5 text-[13px] text-primary bg-primary/10 border-l border-primary -ml-[1px] font-medium">Create a client</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="block pl-4 py-1.5 text-[13px] text-slate-400 hover:text-slate-200 hover:border-slate-500 border-l border-transparent -ml-[1px] transition-colors">Retrieve a client</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="block pl-4 py-1.5 text-[13px] text-slate-400 hover:text-slate-200 hover:border-slate-500 border-l border-transparent -ml-[1px] transition-colors">Update a client</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="block pl-4 py-1.5 text-[13px] text-slate-400 hover:text-slate-200 hover:border-slate-500 border-l border-transparent -ml-[1px] transition-colors">List all clients</Link>
                                        </li>
                                    </ul>
                                </li>

                                {/* Bookings */}
                                <li>
                                    <div className="px-2 py-1 flex items-center justify-between text-sm font-bold text-slate-300 hover:text-slate-200 cursor-pointer group transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-primary/80 transition-colors">event</span>
                                            Bookings
                                        </div>
                                        <span className="material-symbols-outlined text-[18px] text-slate-600">expand_more</span>
                                    </div>
                                </li>

                                {/* Inventory */}
                                <li>
                                    <div className="px-2 py-1 flex items-center justify-between text-sm font-bold text-slate-300 hover:text-slate-200 cursor-pointer group transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-primary/80 transition-colors">inventory_2</span>
                                            Inventory
                                        </div>
                                        <span className="material-symbols-outlined text-[18px] text-slate-600">chevron_right</span>
                                    </div>
                                </li>

                                {/* Staff */}
                                <li>
                                    <div className="px-2 py-1 flex items-center justify-between text-sm font-bold text-slate-300 hover:text-slate-200 cursor-pointer group transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-primary/80 transition-colors">badge</span>
                                            Staff
                                        </div>
                                        <span className="material-symbols-outlined text-[18px] text-slate-600">chevron_right</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </aside>

                {/* Main Content Area (Middle & Right Panes) */}
                <main className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="flex flex-col xl:flex-row min-h-full">

                        {/* Middle Pane - Descriptions & Parameters */}
                        <div className="flex-1 px-8 py-10 xl:border-r border-slate-800/60 max-w-4xl mx-auto xl:mx-0">
                            {/* Endpoint Header */}
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">Create a client</h1>
                                <p className="text-slate-400 leading-relaxed text-base">
                                    Creates a new client object. Any parameters not provided will be left unset. This endpoint returns the created client object if the call succeeded.
                                </p>
                            </div>

                            <hr className="border-slate-800/60 mb-10" />

                            <div className="space-y-10">
                                {/* Endpoint URL Display */}
                                <div>
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-3">Endpoint</h2>
                                    <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 font-mono text-sm max-w-full overflow-x-auto">
                                        <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded">POST</span>
                                        <span className="text-slate-300 select-all">https://api.saunaspa.io/v1/clients</span>
                                    </div>
                                </div>

                                {/* Request Parameters */}
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">data_object</span>
                                        Body Parameters
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Parameter: email */}
                                        <div className="bg-slate-800/20 border border-slate-800/80 rounded-lg p-5">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <code className="text-primary font-bold font-mono bg-primary/10 px-1.5 py-0.5 rounded text-sm">email</code>
                                                    <span className="text-xs text-slate-400 font-mono">string</span>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Required</span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                The client&apos;s email address. Must be a valid email format and unique across all clients in your organization.
                                            </p>
                                        </div>

                                        {/* Parameter: name */}
                                        <div className="bg-slate-800/20 border border-slate-800/80 rounded-lg p-5">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <code className="text-slate-200 font-bold font-mono bg-slate-800 px-1.5 py-0.5 rounded text-sm">name</code>
                                                    <span className="text-xs text-slate-400 font-mono">string</span>
                                                </div>
                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 border border-slate-700 px-2 py-1 rounded">Optional</span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                                The client&apos;s full name or branch name.
                                            </p>
                                        </div>

                                        {/* Parameter: phone */}
                                        <div className="bg-slate-800/20 border border-slate-800/80 rounded-lg p-5">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <code className="text-slate-200 font-bold font-mono bg-slate-800 px-1.5 py-0.5 rounded text-sm">phone</code>
                                                    <span className="text-xs text-slate-400 font-mono">string</span>
                                                </div>
                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 border border-slate-700 px-2 py-1 rounded">Optional</span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                                The client&apos;s phone number. Useful for SMS notifications regarding bookings.
                                            </p>
                                        </div>

                                        {/* Parameter: metadata */}
                                        <div className="bg-slate-800/20 border border-slate-800/80 rounded-lg p-5">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <code className="text-slate-200 font-bold font-mono bg-slate-800 px-1.5 py-0.5 rounded text-sm">metadata</code>
                                                    <span className="text-xs text-slate-400 font-mono">object</span>
                                                </div>
                                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 border border-slate-700 px-2 py-1 rounded">Optional</span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
                                            </p>
                                            <div className="mt-3 text-xs flex items-center gap-2 text-slate-500">
                                                <span className="material-symbols-outlined text-[16px]">info</span>
                                                Up to 50 keys, with key names up to 40 characters long and values up to 500 characters long.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Pane - Code Examples & Responses */}
                        <div className="w-full xl:w-[450px] 2xl:w-[550px] flex-shrink-0 bg-[#070b10] border-t xl:border-t-0 border-slate-800/60 p-6 flex flex-col gap-6 sticky top-0 xl:h-screen">
                            {/* Request Example */}
                            <div className="rounded-lg overflow-hidden border border-slate-800/60 shadow-2xl flex flex-col max-h-[50vh]">
                                <div className="bg-[#111923] px-4 py-2 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-300">REQUEST</span>
                                        <div className="flex gap-2">
                                            <button className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">cURL</button>
                                            <button className="text-[11px] font-mono text-slate-500 hover:text-slate-300 px-2 py-0.5 transition-colors">Node.js</button>
                                            <button className="text-[11px] font-mono text-slate-500 hover:text-slate-300 px-2 py-0.5 transition-colors">Python</button>
                                        </div>
                                    </div>
                                    <CopyButton
                                        text={`curl https://api.saunaspa.io/v1/clients \\
  -u sk_test_123456789: \\
  -d email="jane.doe@example.com" \\
  -d name="Jane Doe" \\
  -d phone="+250788123456"`}
                                    />
                                </div>
                                <div className="bg-[#0c121a] p-4 overflow-auto text-[13px] font-mono leading-relaxed hide-scrollbar">
                                    <div className="text-slate-300"><span className="text-emerald-400">curl</span> https://api.saunaspa.io/v1/clients \</div>
                                    <div className="pl-4 text-slate-300"><span className="text-slate-500">-u</span> sk_test_123456789: \</div>
                                    <div className="pl-4 text-slate-300"><span className="text-slate-500">-d</span> email=<span className="text-amber-300">&quot;jane.doe@example.com&quot;</span> \</div>
                                    <div className="pl-4 text-slate-300"><span className="text-slate-500">-d</span> name=<span className="text-amber-300">&quot;Jane Doe&quot;</span> \</div>
                                    <div className="pl-4 text-slate-300"><span className="text-slate-500">-d</span> phone=<span className="text-amber-300">&quot;+250788123456&quot;</span></div>
                                </div>
                            </div>

                            {/* Response Example */}
                            <div className="rounded-lg overflow-hidden border border-slate-800/60 shadow-2xl flex flex-col flex-1 min-h-[300px]">
                                <div className="bg-[#111923] px-4 py-2 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-300">RESPONSE</span>
                                        <div className="flex gap-2 items-center">
                                            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                            <span className="text-[11px] font-mono text-emerald-400 font-bold">200 OK</span>
                                        </div>
                                    </div>
                                    <CopyButton text={`{
    "id": "cli_9f8g7h6i5j4k3l2m",
    "object": "client",
    "email": "jane.doe@example.com",
    "name": "Jane Doe",
    "phone": "+250788123456",
    "created_at": 1678886400,
    "metadata": {},
    "total_bookings": 0,
    "status": "active"
}`} />
                                </div>
                                <div className="bg-[#0c121a] p-4 overflow-auto text-[13px] font-mono leading-relaxed hide-scrollbar text-slate-300">
                                    {`{`}<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;id&quot;</span>: <span className="text-amber-200">&quot;cli_9f8g7h6i5j4k3l2m&quot;</span>,<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;object&quot;</span>: <span className="text-amber-200">&quot;client&quot;</span>,<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;email&quot;</span>: <span className="text-amber-200">&quot;jane.doe@example.com&quot;</span>,<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;name&quot;</span>: <span className="text-amber-200">&quot;Jane Doe&quot;</span>,<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;phone&quot;</span>: <span className="text-amber-200">&quot;+250788123456&quot;</span>,<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;created_at&quot;</span>: <span className="text-[#a78bfa]">1678886400</span>,<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;metadata&quot;</span>: {`{}`},<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;total_bookings&quot;</span>: <span className="text-[#a78bfa]">0</span>,<br />
                                    &nbsp;&nbsp;<span className="text-primary">&quot;status&quot;</span>: <span className="text-amber-200">&quot;active&quot;</span><br />
                                    {`}`}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
