import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const SearchBar = ({ data, onResultClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);

    // Cmd+K / Ctrl+K to open
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search logic
    useEffect(() => {
        if (!query || !data) {
            setResults([]);
            return;
        }

        const searchQuery = query.toLowerCase();
        const matches = [];

        data.companies?.forEach(company => {
            const companyName = company.company.toLowerCase();

            // Search in company name
            if (companyName.includes(searchQuery)) {
                matches.push({ type: 'Company', company: company.company, detail: company.summary });
            }

            // Search in campaigns
            company.campaigns?.forEach(campaign => {
                if (campaign.name?.toLowerCase().includes(searchQuery) ||
                    campaign.description?.toLowerCase().includes(searchQuery)) {
                    matches.push({ type: 'Campaign', company: company.company, detail: campaign.name });
                }
            });

            // Search in events
            company.events?.forEach(event => {
                if (event.title?.toLowerCase().includes(searchQuery)) {
                    matches.push({ type: 'Event', company: company.company, detail: event.title });
                }
            });

            // Search in Microsoft partner status
            if (company.microsoft_partner_status?.current_level?.toLowerCase().includes(searchQuery)) {
                matches.push({ type: 'Microsoft Status', company: company.company, detail: company.microsoft_partner_status.current_level });
            }
        });

        setResults(matches.slice(0, 10)); // Limit to 10 results
    }, [query, data]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
                onClick={() => setIsOpen(false)}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="w-full max-w-2xl mx-4"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="glass-card rounded-2xl overflow-hidden">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/10">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search companies, campaigns, events, Microsoft status..."
                                className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none text-lg"
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-h-96 overflow-y-auto">
                            {results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((result, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                onResultClick?.(result);
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left p-3 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between group"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                                        {result.type}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-400">{result.company}</span>
                                                </div>
                                                <p className="text-white text-sm line-clamp-1">{result.detail}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : query ? (
                                <div className="p-8 text-center text-slate-500">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    Start typing to search...
                                </div>
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-xs text-slate-500">
                            <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">Cmd+K</kbd>
                            <span>to open</span>
                            <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">ESC</kbd>
                            <span>to close</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SearchBar;
