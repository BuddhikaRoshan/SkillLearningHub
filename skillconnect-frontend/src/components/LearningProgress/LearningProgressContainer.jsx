import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import learningProgressApi from "../../api/learningProgressApi";
import ProgressUpdateCard from "./ProgressUpdateCard";
import ProgressUpdateModal from "./ProgressUpdateModal";

const LearningProgressContainer = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      let userUpdates = await learningProgressApi.getAllProgressUpdates();
      userUpdates = userUpdates.reverse();
      userUpdates = userUpdates.filter((progress) => {
        return (
          progress.userId === localStorage.getItem("userId") || progress.public
        );
      });
      setUpdates(userUpdates);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUpdate = async (updateData) => {
    try {
      setLoading(true);
      const newUpdate = await learningProgressApi.createProgressUpdate({
        ...updateData,
        userId,
        public: updateData.isPublic,
      });
      setUpdates([newUpdate, ...updates]);
      toast.success("Progress update created successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updateData) => {
    try {
      setLoading(true);
      const updatedUpdate = await learningProgressApi.updateProgressUpdate(id, {
        ...updateData,
        public: updateData.isPublic,
      });
      setUpdates(
        updates.map((update) => (update.id === id ? updatedUpdate : update))
      );
      toast.success("Progress update updated successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await learningProgressApi.deleteProgressUpdate(id);
      setUpdates(updates.filter((update) => update.id !== id));
      toast.success("Progress update deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setCurrentUpdate(null);
    setModalMode("create");
    setShowModal(true);
  };

  const openEditModal = (update) => {
    setCurrentUpdate(update);
    setModalMode("edit");
    setShowModal(true);
  };

  if (loading && updates.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Learning Progress</h1>
        <button
  onClick={openCreateModal}
  style={{ backgroundColor: "#1b5e20" }}
  className="hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center"
>
  <FiPlus className="mr-2" />
  Add Update
</button>

      </div>

      <div className="grid grid-cols-1 gap-6">
        {updates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No progress updates yet. Add your first update!
            </p>
          </div>
        ) : (
          updates.map((update) => (
            <ProgressUpdateCard
              key={update.id}
              update={update}
              userId={userId}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showModal && (
        <ProgressUpdateModal
          onClose={() => setShowModal(false)}
          onSubmit={
            modalMode === "create"
              ? handleCreateUpdate
              : (data) => handleUpdate(currentUpdate.id, data)
          }
          initialData={currentUpdate}
          mode={modalMode}
          show={showModal}
        />
      )}
    </div>
  );
};

export default LearningProgressContainer;
