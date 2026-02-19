interface ReviewStarsProps {
  ocena: number; // 1-5
  editable?: boolean;
  onChange?: (ocena: number) => void;
}

const ReviewStars = ({ ocena, editable = false, onChange }: ReviewStarsProps) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => editable && onChange?.(star)}
          style={{ cursor: editable ? 'pointer' : 'default' }}
        >
          {star <= ocena ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default ReviewStars;
