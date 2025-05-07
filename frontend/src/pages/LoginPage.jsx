import Logo from "../assets/ai-translate.svg";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md p-10 text-center bg-white shadow-2xl rounded-3xl">
        <img src={Logo} alt="Your Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          Welcome to TranslateX
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Translate smarter, faster, and with context accuracy.
        </p>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/api/auth/google")
          }
          className="flex items-center justify-center w-full px-6 py-3 space-x-4 text-white transition duration-300 ease-in-out bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <span className="text-lg font-semibold">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
