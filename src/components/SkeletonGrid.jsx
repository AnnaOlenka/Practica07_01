// Skeleton loader mientras se hace fetch — sin re-render innecesario
export default function SkeletonGrid({ count = 10 }) {
  return (
    <div className="series-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="series-card" style={{ pointerEvents: 'none' }}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3' }} />
          <div className="series-card-body">
            <div className="skeleton" style={{ height: 14, width: '80%' }} />
            <div className="skeleton" style={{ height: 12, width: '55%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}