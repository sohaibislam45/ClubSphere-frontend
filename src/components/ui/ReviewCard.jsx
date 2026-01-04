import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="size-12 rounded-full bg-cover bg-center bg-gray-200 dark:bg-border-dark"
            style={{
              backgroundImage: review.user?.photoURL
                ? `url("${review.user.photoURL}")`
                : 'none'
            }}
          >
            {!review.user?.photoURL && (
              <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  person
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-gray-900 dark:text-white">
              {review.user?.name || 'Anonymous'}
            </p>
            <p className="text-sm text-text-muted dark:text-text-secondary">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} interactive={false} size="md" />
      </div>
      <p className="text-text-muted dark:text-text-secondary leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
