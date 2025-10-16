const StatCard = ({ icon: Icon, label, value, color, children }) => (
  <div className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color.bg}`}
    >
      <Icon className={`h-5 w-5 ${color.text}`} />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {value && <p className="text-sm font-semibold text-gray-800">{value}</p>}
      {children}
    </div>
  </div>
);

export default StatCard;
