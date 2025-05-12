const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      <p className="mt-4 text-lg font-semibold text-gray-800 font-poppins">
        {message}
      </p>
    </div>
  );
};

export default Loading;
