interface ReviewStarsProps {
  ocena: number;
  max?: number;
  editable?: boolean;
  onChange?: (ocena: number) => void;
}

const ReviewStars = ({ ocena, max = 5, editable = false, onChange }: ReviewStarsProps) => {
  return (
    <span className={`text-amber-400 tracking-wide ${editable ? 'text-2xl' : 'text-base'}`}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        return (
          <span
            key={star}
            onClick={() => editable && onChange?.(star)}
            className={editable ? 'cursor-pointer hover:text-amber-500 transition-colors' : ''}
          >
            {star <= Math.round(ocena) ? '★' : '☆'}
          </span>
        );
      })}
    </span>
  );
};

export default ReviewStars;
