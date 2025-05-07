import { useState } from "react";

const ProjectForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [sentences, setSentences] = useState([""]);

  const updateSentence = (value, index) => {
    const updated = [...sentences];
    updated[index] = value;
    setSentences(updated);
  };

  const addSentence = () => setSentences([...sentences, ""]);
  const removeSentence = (index) => {
    const updated = sentences.filter((_, i) => i !== index);
    setSentences(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sentences.filter(Boolean).length === 0) {
      alert("Please enter at least one sentence.");
      return;
    }
    const payload = {
      title,
      domain,
      sentences: sentences.filter(Boolean).map((source) => ({ source })),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium text-gray-700">Project Title</label>
        <input
          type="text"
          className="w-full p-2 mt-1 border rounded-xl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Domain / Context
        </label>
        <select
          className="w-full p-2 mt-1 border rounded-xl"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        >
          <option value="">Select domain</option>
          <option value="ecommerce">E-commerce</option>
          <option value="legal">Legal</option>
          <option value="finance">Finance</option>
          <option value="medical">Medical</option>
          <option value="technical">Technical</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          English Sentences
        </label>
        {sentences.map((text, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={text}
              onChange={(e) => updateSentence(e.target.value, i)}
              className="flex-1 p-2 border rounded-xl"
              placeholder={`Sentence ${i + 1}`}
              required
            />
            {sentences.length > 1 && (
              <button
                type="button"
                onClick={() => removeSentence(i)}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSentence}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Add another sentence
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Translating..." : "Translate & Save"}
      </button>
    </form>
  );
};

export default ProjectForm;
