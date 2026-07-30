import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Clock, 
  FileText,
  Loader2
} from 'lucide-react';
import axios from 'axios';

export default function HistoryPage({ showToast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [page, search]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/history?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
      if (response.data && response.data.data) {
        setHistory(response.data.data);
        setTotalPages(response.data.pagination.total_pages);
        setTotalItems(response.data.pagination.total_items);
      }
    } catch (err) {
      console.log('Error fetching prediction history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (id) => {
    try {
      await axios.delete(`/api/history/${id}`);
      showToast('Record deleted successfully.');
      fetchHistory();
    } catch (err) {
      showToast('Failed to delete record.', 'error');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('/api/history');
      setDeleteConfirmModal(false);
      showToast('All prediction history cleared.');
      fetchHistory();
    } catch (err) {
      showToast('Failed to clear history.', 'error');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/history/export', '_blank');
    showToast('Exporting prediction history as CSV...');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <History className="w-8 h-8 text-blue-600" />
            <span>Prediction Audit History</span>
          </h1>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Stored prediction logs with confidence scores, timestamps, and CSV export.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            disabled={totalItems === 0}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setDeleteConfirmModal(true)}
            disabled={totalItems === 0}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/40 border border-rose-300 dark:border-rose-800 disabled:opacity-40 text-xs font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-300 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search news content or prediction label..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Showing {history.length} of {totalItems} total entries
        </div>
      </div>

      {/* History List Table / Cards */}
      {loading ? (
        <div className="py-12 flex justify-center items-center text-slate-600 dark:text-slate-300 space-x-2 font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading history records...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-300 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">No History Records Found</h3>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-sm mx-auto">
            {search ? 'No results matched your search term.' : 'Run your first news article prediction to populate the audit database.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const isReal = item.prediction === 'Real';
            return (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-slate-300 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg ${
                      isReal
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
                    }`}>
                      {item.prediction} ({item.confidence}%)
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-1 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(item.created_at).toLocaleString()}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-900 dark:text-slate-100 line-clamp-3 leading-relaxed font-semibold">
                    "{item.news_text}"
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteSingle(item.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors self-end md:self-center"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clear All History?</h3>
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete all {totalItems} prediction audit records from the SQLite database? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/30"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
