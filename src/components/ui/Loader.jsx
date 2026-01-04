import React from 'react';

const Loader = () => {
  const squareStyle = {
    animation: 'square-animation 10s ease-in-out infinite both'
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-24 h-24 rotate-45">
        <div 
          className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-primary dark:bg-primary rounded-none"
          style={{ ...squareStyle, animationDelay: '0s' }}
        ></div>
        <div 
          className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-primary dark:bg-primary rounded-none"
          style={{ ...squareStyle, animationDelay: '-1.4285714286s' }}
        ></div>
        <div 
          className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-primary dark:bg-primary rounded-none"
          style={{ ...squareStyle, animationDelay: '-2.8571428571s' }}
        ></div>
        <div 
          className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-primary dark:bg-primary rounded-none"
          style={{ ...squareStyle, animationDelay: '-4.2857142857s' }}
        ></div>
        <div 
          className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-primary dark:bg-primary rounded-none"
          style={{ ...squareStyle, animationDelay: '-5.7142857143s' }}
        ></div>
        <div 
          className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-primary dark:bg-primary rounded-none"
          style={{ ...squareStyle, animationDelay: '-7.1428571429s' }}
        ></div>
        <div 
          className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-primary dark:bg-primary rounded-none"
          style={{ ...squareStyle, animationDelay: '-8.5714285714s' }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
