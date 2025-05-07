import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProject } from "../features/projects/projects.slice";
import { useNavigate } from "react-router-dom";

const NewProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    sentences: "",
    language: "french",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await dispatch(createProject(formData)).unwrap();
      navigate(`/projects/${result._id}`);
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto bg-white shadow-lg rounded-2xl">
      <h2 className="mb-6 text-3xl font-extrabold text-blue-600">
        Create New Translation Project
      </h2>

      <form onSubmit={handleCreate}>
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Domain</label>
          <select
            name="domain"
            value={formData.domain}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select domain</option>
            <option value="ecommerce">Ecommerce</option>
            <option value="legal">Legal</option>
            <option value="medical">Medical</option>
            <option value="finance">Finance</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-600">
            Sentences (in English)
          </label>
          <textarea
            name="sentences"
            value={formData.sentences}
            onChange={handleInputChange}
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter each English sentence on a new line."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Select Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Language</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="spanish">Spanish</option>
            <option value="italian">Italian</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-6 py-3 text-white transition bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;
