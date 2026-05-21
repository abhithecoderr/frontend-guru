

// Proportional rebalancing logic
function rebalanceValues(values, idx, newRawVal, updateFn) {
  const newVal = Math.max(5, Math.min(95, parseFloat(newRawVal) || 10));
  const current = [...values];
  const oldVal  = current[idx];
  const delta   = newVal - oldVal;

  current[idx] = newVal;

  const otherCount = current.length - 1;
  if (otherCount > 0) {
    const sumOther = current.reduce((acc, v, i) => i === idx ? acc : acc + v, 0);
    if (sumOther > 0) {
      for (let i = 0; i < current.length; i++) {
        if (i !== idx) {
          const ratio = current[i] / sumOther;
          current[i] = Math.max(5, Math.round((current[i] - delta * ratio) * 100) / 100);
        }
      }
    } else {
      const fallback = Math.round(((100 - newVal) / otherCount) * 100) / 100;
      for (let i = 0; i < current.length; i++) {
        if (i !== idx) current[i] = fallback;
      }
    }
  }

  // Correct any floating-point rounding drift so sum === 100
  const totalSum = current.reduce((a, b) => a + b, 0);
  if (totalSum !== 100) {
    const diff = 100 - totalSum;
    const targetIdx = idx === 0 ? 1 : 0;
    if (current[targetIdx] !== undefined) {
      current[targetIdx] = Math.round((current[targetIdx] + diff) * 100) / 100;
    }
  }

  updateFn(current);
}

export default function LayoutRebalancer({ node, actions }) {
  if (node.type === 'FlexRow') {
    const count = node.props.columnsCount || 3;
    const widths = node.props.columnWidths || Array(count).fill(100 / count);

    return (
      <div className="inspector-rebalancer">
        <div className="inspector__section-label">Configure Columns Widths (%)</div>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="inspector-rebalancer-row">
            <div className="inspector-rebalancer-header">
              <span className="inspector-rebalancer-label">Column {idx + 1}</span>
              <span className="inspector-rebalancer-value">{widths[idx]}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              step="0.5"
              className="inspector-rebalancer-range"
              value={widths[idx] || (100 / count)}
              onChange={(e) =>
                rebalanceValues(widths, idx, e.target.value, (updated) =>
                  actions.updateProps(node.id, { columnWidths: updated })
                )
              }
            />
          </div>
        ))}
      </div>
    );
  }

  if (node.type === 'FlexColumn') {
    const count = node.props.rowsCount || 3;
    const heights = node.props.rowHeights || Array(count).fill(100 / count);

    return (
      <div className="inspector-rebalancer">
        <div className="inspector__section-label">Configure Rows Heights (%)</div>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="inspector-rebalancer-row">
            <div className="inspector-rebalancer-header">
              <span className="inspector-rebalancer-label">Row {idx + 1}</span>
              <span className="inspector-rebalancer-value">{heights[idx]}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              step="0.5"
              className="inspector-rebalancer-range"
              value={heights[idx] || (100 / count)}
              onChange={(e) =>
                rebalanceValues(heights, idx, e.target.value, (updated) =>
                  actions.updateProps(node.id, { rowHeights: updated })
                )
              }
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
