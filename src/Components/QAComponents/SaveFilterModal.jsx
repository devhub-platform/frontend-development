// src/Components/QAComponents/SaveFilterModal.jsx
import React from "react";
import { X } from "lucide-react";

export function SaveFilterModal({ open, initialName = "", onClose, onSave }) {
  const [name, setName] = React.useState(initialName);

  React.useEffect(() => {
    if (open) setName(initialName || "");
  }, [open, initialName]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-bg-primary-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Save filter
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Filter name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Unanswered React questions"
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-text-light"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-text-light transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
