import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../features/projects/projects.slice";
import { useParams, Link } from "react-router-dom";

const ViewProject = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProject: project, status } = useSelector(
    (state) => state.projects
  );

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  if (status === "loading" || !project) {
    return <div className="p-4 text-gray-600">Loading project...</div>;
  }

  return (
    <div className="max-w-4xl p-6 mx-auto shadow-lg bg-gray-50 rounded-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          {project.title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-medium">Domain:</span> {project.domain}
        </p>
      </div>

      <div className="space-y-6">
        {project.sentences.map((sentence, index) => (
          <div
            key={index}
            className="p-6 transition bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-lg"
          >
            <p className="mb-2 text-sm text-gray-400">Sentence #{index + 1}</p>
            <p className="mb-2 font-medium text-gray-800">
              EN: {sentence.source}
            </p>
            <p className="text-blue-700">
              <span className="font-semibold">FR:</span> {sentence.translated}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          to={`/projects/${project._id}/edit`}
          className="inline-block px-6 py-3 font-medium text-white transition duration-300 bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Edit Translations
        </Link>
      </div>
    </div>
  );
};

export default ViewProject;
