'use client';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-20 gap-3 text-slate-400 font-semibold text-sm">
      <div className="w-8 h-8 rounded-full border-[3px] border-pink-100 border-t-pink-500 animate-spin" />
      <span>Loading details...</span>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 gap-4 text-center bg-red-50/50 border border-red-100 rounded-2xl max-w-xl mx-auto my-8 shadow-sm">
      <div className="text-4xl filter drop-shadow-sm">⚠️</div>
      <div>
        <p className="text-red-600 font-bold text-base">Failed to retrieve data</p>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button 
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-5 hover:border-slate-350 transition-colors active:scale-[0.98] mt-2 shadow-sm" 
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function StatCard({ label, value, icon }) {
  return (
    <div className="relative border border-slate-200 rounded-2xl p-6 bg-white shadow-sm transition-all duration-300 hover:border-pink-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
        {icon && <div className="text-2xl filter drop-shadow-sm">{icon}</div>}
      </div>
      <div className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
        {value}
      </div>
    </div>
  );
}

export function EmptyState({ icon = '📭', title = 'No data yet', subtitle }) {
  return (
    <div className="text-center px-6 py-16 text-slate-400 flex flex-col items-center gap-2">
      <div className="text-5xl mb-2 opacity-50 filter drop-shadow-sm">{icon}</div>
      <p className="font-bold text-slate-600 text-sm">{title}</p>
      {subtitle && <p className="text-xs max-w-[280px] leading-relaxed text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active:    'badge-success',
    confirmed: 'badge-success',
    paid:      'badge-success',
    open:      'badge-success',
    success:   'badge-success',
    pending:   'badge-warning',
    draft:     'badge-warning',
    inactive:  'badge-warning',
    trial:     'badge-warning',
    cancelled: 'badge-danger',
    suspended: 'badge-danger',
    failed:    'badge-danger',
    refunded:  'badge-danger',
  };
  const cls = map[status] || 'badge-primary';
  return <span className={`badge ${cls}`}>{status}</span>;
}
