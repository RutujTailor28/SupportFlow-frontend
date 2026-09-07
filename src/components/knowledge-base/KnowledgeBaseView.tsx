'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Search,
  Plus,
  Sparkles,
  Layers,
  Database,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  RotateCw,
  Tag,
  CheckCircle2,
  BookPlus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { KBCategory, KBArticle } from '../../types/knowledgeBase';
import { ArticleEditorModal } from './ArticleEditorModal';
import { ArticlePreviewModal } from '../tickets/ArticlePreviewModal';
import { formatTimeAgo } from '../../lib/utils';

export const KnowledgeBaseView: React.FC = () => {
  const {
    articles,
    contentGaps,
    deleteArticle,
    reindexArticle,
    setIsArticleEditorOpen,
    setEditingArticle,
    setPreviewArticleId,
    createArticleFromGap,
    isDataLoading,
    dataError,
    useMockData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'articles' | 'gaps'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KBCategory | 'all'>('all');

  if (!useMockData && isDataLoading) {
    return (
      <div id="knowledge-base-view" className="space-y-6 pb-12">
        <div className="h-24 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
        <div className="h-96 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
      </div>
    );
  }

  if (!useMockData && dataError && articles.length === 0) {
    return (
      <div id="knowledge-base-view" className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Knowledge base unavailable</p>
        <p className="text-xs text-slate-500 mt-1">Fix the API connection and retry from the banner above.</p>
      </div>
    );
  }

  const filteredArticles = articles.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSummary = a.summary.toLowerCase().includes(q);
      const matchTags = a.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchTags) return false;
    }
    return true;
  });

  const totalChunks = articles.reduce((acc, curr) => acc + curr.chunksCount, 0);

  const categories: (KBCategory | 'all')[] = [
    'all',
    'Billing',
    'Technical',
    'Account',
    'Features',
    'Shipping',
    'Security',
  ];

  return (
    <div id="knowledge-base-view" className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Intelligence Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Indexed Articles</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {articles.length}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            ● 100% active in RAG index
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Vector Chunks</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalChunks}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            768 dims • text-embedding-004
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Retrieval Precision</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            94.8%
          </p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
            Cosine similarity threshold 0.82
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Content Gaps</span>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {contentGaps.length}
          </p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            Identified from ticket volume
          </span>
        </div>
      </div>

      {/* Main Tabs and Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'articles'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Indexed Articles ({articles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gaps'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Content Gap Detector ({contentGaps.length})</span>
          </button>
        </div>

        {/* Create Article CTA */}
        <Button
          size="sm"
          onClick={() => {
            setEditingArticle(null);
            setIsArticleEditorOpen(true);
          }}
          className="gap-1.5 font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Button>
      </div>

      {/* TAB 1: Indexed Articles */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          {/* Search and Category Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge articles by title, tag, or content..."
                className="w-full pl-9.5 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="purple" size="sm">
                      {article.category}
                    </Badge>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        article.status === 'indexed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {article.status === 'indexed' ? '● Indexed' : '○ Processing'}
                    </span>
                  </div>

                  <h3
                    onClick={() => setPreviewArticleId(article.id)}
                    className="text-sm font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-500">
                    {article.chunksCount} Chunks
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewArticleId(article.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Preview Article"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingArticle(article);
                        setIsArticleEditorOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => reindexArticle(article.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Recompute Embeddings"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Content Gap Detector */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <h4 className="font-bold">Automated Knowledge Deficit Detection</h4>
              <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300">
                The NLP clustering algorithm analyzes incoming tickets where AI confidence was under 80% or where agents answered without referencing a KB document. Creating articles for these gaps immediately boosts automated resolution rates.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {contentGaps.map((gap) => (
              <div
                key={gap.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {gap.topic}
                    </h3>
                    <Badge variant="warning" size="sm">
                      {gap.suggestedCategory}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {gap.description}
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{gap.ticketCount} recent customer tickets</span>
                    </span>
                    <span>•</span>
                    <span className="italic">
                      Sample query: "{gap.sampleQueries[0]}"
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => createArticleFromGap(gap.id)}
                    className="px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl border border-indigo-200/80 dark:border-indigo-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <BookPlus className="w-4 h-4" />
                    <span>Create Knowledge Article</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ArticleEditorModal />
      <ArticlePreviewModal />
    </div>
  );
};
