const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 text-center bg-white shadow-lg rounded-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Sign in to your account
        </h2>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition duration-150 bg-red-500 rounded-lg hover:bg-red-600"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#ffffff"
              d="M44.5 20H24v8.5h11.8C34.1 32.8 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.2 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.2-7.5 20.2-21 0-1.4-.1-2.5-.3-4z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
