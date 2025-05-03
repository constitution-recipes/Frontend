export default function ConstitutionCard({ constitution, reason, confidence }) {
  return (
    <div className="max-w-md mx-auto bg-card border border-border rounded-lg shadow p-6 my-4">
      <h2 className="text-xl font-semibold mb-2">당신의 체질: {constitution}</h2>
      <p className="text-sm text-muted mb-4">진단 이유: {reason}</p>
      <p className="text-sm text-muted">신뢰도: {(confidence * 100).toFixed(1)}%</p>
    </div>
  );
} 