"use client";

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const goPrev = () => {
    if (month === 1) onChange(year - 1, 12);
    else onChange(year, month - 1);
  };

  const goNext = () => {
    if (month === 12) onChange(year + 1, 1);
    else onChange(year, month + 1);
  };

  return (
    <div className="month-nav">
      <button type="button" className="btn" onClick={goPrev}>
        ← 前月
      </button>
      <strong>
        {year}年{month}月
      </strong>
      <button type="button" className="btn" onClick={goNext}>
        翌月 →
      </button>
    </div>
  );
}
