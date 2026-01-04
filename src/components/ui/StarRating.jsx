const StarRating = ({ rating, onRate, interactive = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          className={`material-symbols-outlined ${sizeClasses[size]} ${
            star <= rating
              ? 'text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        >
          {star <= rating ? 'star' : 'star'}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
