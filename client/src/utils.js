import axios from "axios";
import { useState } from "react";

export const changeFieldHandler = async (url, body, token) => {
  await axios.put(url, body, {
    headers: { "x-access-token": token },
  });
};

export const addFieldHandler = async (url, body, token) => {
  await axios.post(url, body, {
    headers: {
      "x-access-token": token,
    },
  });
};

export const useSelectedItem = () => {
  const [selectedType, setSelectedType] = useState({});

  return { selectedType, setSelectedType };
};

export const useToggleModalOpen = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const openAddModal = () => {
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const onAdd = () => {
    openAddModal();
  };

  return {
    addModalOpen,
    openAddModal,
    closeAddModal,
    editModalOpen,
    openEditModal,
    closeEditModal,
    onAdd,
  };
};
