'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { KBArticle, KBCategory, IndexingStatus } from '../../types/knowledgeBase';
import { BookOpen, Sparkles, Tag, Layers, FileText } from 'lucide-react';

export const ArticleEditorModal: React.FC = () => {
  const {
    isArticleEditorOpen,
    setIsArticleEditorOpen,
    editingArticle,
    setEditingArticle,
    createArticle,
    updateArticle,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<KBCategory>('Billing');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<IndexingStatus>('indexed');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setCategory(editingArticle.category as KBCategory);
      setSummary(editingArticle.summary);
      setContent(editingArticle.content);
      setTagsInput(editingArticle.tags.join(', '));
      setStatus(editingArticle.status);
    } else {
      setTitle('');
      setCategory('Billing');
      setSummary('');
      setContent('');
      setTagsInput('Documentation, Guide');
      setStatus('indexed');
    }
  }, [editingArticle, isArticleEditorOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    setTimeout(() => {
      if (editingArticle && editingArticle.id) {
        updateArticle(editingArticle.id, {
          title,
          slug,
          category,
          summary: summary || title,
          content,
          tags,
          status,
        });
      } else {
        createArticle({
          title,
          slug,
          category,
          summary: summary || title,
          content,
          tags,
          status,
        });
      }

      setIsSaving(false);
      setIsArticleEditorOpen(false);
      setEditingArticle(null);
    }, 400);
  };

  const estimatedChunks = Math.ceil(content.length / 400) || 1;

  return (
    <Modal
      isOpen={isArticleEditorOpen}
      onClose={() => {
        setIsArticleEditorOpen(false);
        setEditingArticle(null);
      }}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{editingArticle && editingArticle.id ? 'Edit Knowledge Article' : 'Create Knowledge Article'}</span>
        </div>
      }
      description="Articles are automatically chunked, embedded via text-embedding-004, and used by AI for grounding"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Article Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to Configure SAML Single Sign-On"
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as KBCategory)}
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Features">Features</option>
              <option value="Shipping">Shipping</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Executive Summary / Search Snippet
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One-sentence description for vector matching..."
            className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Article Content (Markdown Supported)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              ~{estimatedChunks} Vector Chunks ({content.length} chars)
            </span>
          </div>
          <textarea
            required
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Title\n\n## Overview\nExplain the procedure or policy step by step..."
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. SSO, Okta, Security, Enterprise"
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Indexing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="indexed">Indexed & Active (Available to AI)</option>
              <option value="draft">Draft (Hidden from AI)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsArticleEditorOpen(false);
              setEditingArticle(null);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSaving}
            className="font-semibold shadow-xs"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Save & Compute Vectors</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
