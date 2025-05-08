import { useState } from "react";
import Modal from "react-modal";
import { Button, Box } from "@mui/material";

const ProgressUpdateModal = ({
  onClose,
  onSubmit,
  initialData,
  mode,
  show,
}) => {
  const [content, setContent] = useState(initialData?.content || "");
  const [templateType, setTemplateType] = useState(
    initialData?.templateType || ""
  );
  const [completedProgress, setCompletedProgress] = useState(
    initialData?.completedProgress || 0
  );
  const [isPublic, setIsPublic] = useState(initialData?.public || false);
  const [errors, setErrors] = useState({});
  const [estimatedTime, setEstimatedTime] = useState(
    initialData?.estimatedTime || 0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!content.trim()) newErrors.content = "Content is required";
    if (!templateType.trim()) newErrors.templateType = "Type is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      content,
      templateType,
      completedProgress,
      estimatedTime,
      isPublic,
    });
  };

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "90vh",
      overflow: "auto",
      padding: "0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      marginTop: "50px", // Adding margin to push the form down
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <Modal isOpen={show} onRequestClose={onClose} style={customModalStyles}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Add Progress Update" : "Edit Progress Update"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Type
              </label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.templateType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a type</option>
                <option value="completed_tutorial">Completed Tutorial</option>
                <option value="new_skill">New Skill</option>
                <option value="milestone">Milestone</option>
                <option value="reflection">Reflection</option>
              </select>
              {errors.templateType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.templateType}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe your learning progress..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completed Progress: {(completedProgress * 100).toFixed(0)}%
              </label>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">0%</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={completedProgress}
                  onChange={(e) =>
                    setCompletedProgress(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500 ml-2">100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full"
                  style={{ width: `${completedProgress * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (in hours)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 1.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Approximate time spent or planned for this update
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">
                  {isPublic ? "Public" : "Private"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isPublic ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {isPublic
                  ? "This progress update will be visible to others"
                  : "This progress update will only be visible to you"}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  color="success"
                  style={{
                    textTransform: "none",
                    borderColor: "#1b5e20",
                    color: "#1b5e20",
                  }}
                  className="hover:bg-[#1b5e20] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  style={{
                    backgroundColor: "#1b5e20",
                    textTransform: "none",
                  }}
                  className="hover:bg-[#156c19]"
                >
                  {mode === "create" ? "Create Update" : "Save Changes"}
                </Button>
              </Box>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ProgressUpdateModal;
