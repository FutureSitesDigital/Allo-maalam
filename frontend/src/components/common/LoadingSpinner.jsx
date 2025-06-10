const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        <div className="absolute top-1 left-1 right-1 bottom-1 bg-blue-100 rounded-full animate-pulse opacity-60"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
