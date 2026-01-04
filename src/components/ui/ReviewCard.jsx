import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="size-12 rounded-full bg-cover bg-center flex-shrink-0"
            style={{
              backgroundImage: review.userPhoto
                ? `url("${review.userPhoto}")`
                : 'none',
              backgroundColor: '#1c2620'
            }}
          >
            {!review.userPhoto && (
              <span className="material-symbols-outlined text-white text-2xl flex items-center justify-center w-full h-full">person</span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{review.userName}</p>
            <p className="text-sm text-text-muted dark:text-text-secondary">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly={true} size="sm" />
      </div>
      <p className="text-text-muted dark:text-text-secondary leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;

