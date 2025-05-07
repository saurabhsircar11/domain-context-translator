import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
} from "../features/projects/projects.slice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: projects, status } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(id));
    }
  };

  return (
    <div className="max-w-6xl p-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-blue-600">
          Your Translation Projects
        </h1>
        <Link
          to="/projects/new"
          className="px-6 py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          + New Project
        </Link>
      </div>

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
              className="p-6 transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                {project.title}
              </h2>
              <p className="mb-3 text-sm text-gray-500">
                Domain: {project.domain}
              </p>
              <p className="mb-4 text-sm text-gray-400">
                {project.sentences.length} sentence
                {project.sentences.length !== 1 ? "s" : ""}
              </p>

              <div className="flex gap-4">
                <Link
                  to={`/projects/${project._id}`}
                  className="px-4 py-2 text-sm text-white rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  View
                </Link>
                <Link
                  to={`/projects/${project._id}/edit`}
                  className="px-4 py-2 text-sm text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
