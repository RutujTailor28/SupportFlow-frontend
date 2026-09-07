'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { BookOpen, ExternalLink, ThumbsUp, Eye, Sparkles, Check } from 'lucide-react';

export const ArticlePreviewModal: React.FC = () => {
  const { previewArticleId, setPreviewArticleId, articles, reindexArticle } = useApp();

  const article = articles.find(a => a.id === previewArticleId);

  if (!article) return null;

  return (
    <Modal
      isOpen={!!previewArticleId}
      onClose={() => setPreviewArticleId(null)}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="truncate">{article.title}</span>
        </div>
      }
      description={
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">{article.category}</Badge>
          <span className="text-slate-400">•</span>
          <span>{article.chunksCount} Vector Chunks</span>
          <span className="text-slate-400">•</span>
          <span>Embedding: {article.embeddingModel}</span>
        </div>
      }
    >
      <div className="space-y-4 text-xs md:text-sm text-slate-700 dark:text-slate-300">
        {/* Summary callout */}
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Knowledge Summary</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">{article.summary}</p>
        </div>

        {/* Content body formatted */}
        <div className="prose dark:prose-invert max-w-none text-xs md:text-sm font-sans whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          {article.content}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <span className="text-xs text-slate-400 font-medium">Tags:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.viewCount} views</span>
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{article.helpfulVotes} helpful votes</span>
            </span>
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Used by AI {article.aiUsageCount} times</span>
            </span>
          </div>

          <button
            onClick={() => {
              reindexArticle(article.id);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Re-index Embeddings
          </button>
        </div>
      </div>
    </Modal>
  );
};
