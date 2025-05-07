import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  updateProject,
} from "../features/projects/projects.slice";
import { useParams, useNavigate } from "react-router-dom";

const EditProject = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProject: project, status } = useSelector(
    (state) => state.projects
  );

  const [translations, setTranslations] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (project?.sentences) {
      setTranslations(project.sentences.map((s) => s.translated));
    }
  }, [project]);

  const handleChange = (index, value) => {
    const updated = [...translations];
    updated[index] = value;
    setTranslations(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedSentences = project.sentences.map((s, i) => ({
      ...s,
      translated: translations[i],
    }));
    try {
      await dispatch(
        updateProject({
          id: project._id,
          sentences: updatedSentences,
        })
      );
      navigate(`/projects/${project._id}`);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !project) {
    return <div className="p-4 text-gray-600">Loading project...</div>;
  }

  return (
    <div className="max-w-4xl p-6 mx-auto shadow-lg bg-gray-50 rounded-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Edit Translations
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Domain: <span className="text-blue-600">{project.domain}</span>
      </p>

      <div className="space-y-6">
        {project.sentences.map((s, i) => (
          <div
            key={i}
            className="p-6 transition bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-lg"
          >
            <p className="mb-2 text-sm text-gray-500">Sentence #{i + 1}</p>
            <p className="mb-2 text-sm font-medium text-gray-800">
              EN: {s.source}
            </p>
            <textarea
              value={translations[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full p-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter translation here..."
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 text-white rounded-xl font-semibold transition ${
            saving
              ? "bg-blue-500 opacity-50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditProject;
