import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center  bg-white p-8 rounded-lg shadow-lg max-w-8/12 mx-auto ">
      <div className="text-center ">
        <h1 className="text-7xl font-bold text-blue-500">404</h1>
        <p className="mt-4 text-2xl font-semibold">Oops! Page Not Found</p>
        <p className="mt-2 text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="mt-8">
        {/* <div className=" justify-center items-center">
          <img
            className="w-[500px] h-[300px] rounded-lg"
            src="https://i.ibb.co.com/W32SjWD/image.png"
            alt=""
          />
        </div> */}
        <div className="items-center justify-center text-center">
          <button
            className="btn btn-primary mt-6 px-6 py-2"
            onClick={() => navigate("/")}
          >
            Return to the homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
