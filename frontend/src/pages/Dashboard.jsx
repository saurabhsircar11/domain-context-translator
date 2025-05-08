import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
} from "../features/projects/projects.slice";
import { Link } from "react-router-dom";
import { FiEye, FiEdit2, FiTrash2, FiGlobe } from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: projects, status } = useSelector((state) => state.projects);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(id));
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="px-6 py-8 mb-10 text-center border border-blue-100 shadow-sm rounded-2xl bg-white/70 backdrop-blur-sm">
          <FiGlobe className="mx-auto mb-2 text-3xl text-blue-500" />
          <h1 className="mb-2 text-2xl font-semibold text-blue-800">
            TranslateX Dashboard
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-gray-600">
            View, edit, and manage your translation projects across different
            domains — all in one place.
          </p>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h2>
          <p className="text-sm text-gray-500">
            Let’s get back to translating ✨
          </p>
        </div>
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
          <h2 className="text-2xl font-bold text-gray-700">
            Your Translation Projects
          </h2>
          <Link
            to="/projects/new"
            className="px-6 py-3 mt-4 font-semibold text-white transition rounded-lg md:mt-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            + New Project
          </Link>
        </div>

        {/* Projects */}
        {status === "loading" ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500">
            No projects yet. Create your first one!
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="p-6 transition-all duration-300 transform bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-xl hover:-translate-y-1"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  {project.title}
                </h3>
                <p className="mb-2 text-sm text-gray-500">
                  Domain: <span className="font-medium">{project.domain}</span>
                </p>
                <p className="mb-4 text-sm text-gray-400">
                  {project.sentences.length} sentence
                  {project.sentences.length !== 1 ? "s" : ""}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/projects/${project._id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    <FiEye /> View
                  </Link>
                  <Link
                    to={`/projects/${project._id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                  >
                    <FiEdit2 /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
