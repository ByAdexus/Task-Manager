import React, { useState } from 'react';
import { editTask, deleteTask } from '../../services/storageService';

function TaskCard({ task, updateTaskInState, deleteTaskInState }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: task.title, description: task.description });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const updatedTask = { ...task, ...editedTask };
    await editTask(task.id, updatedTask);
    updateTaskInState(task.id, updatedTask);
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      await deleteTask(task.id);
      deleteTaskInState(task.id);
    }
  };

  return (
    <div
      className="shadow-lg rounded-lg p-4 flex justify-between items-center mb-4 transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
      style={{
        backgroundColor: `${task.color}69`, // Fondo dinámico basado en prioridad
      }}
    >
      <div className="flex flex-col w-full mx-4">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="p-2 mb-2 w-full border border-gray-300 rounded-md"
              placeholder="Título"
            />
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="p-2 mb-2 w-full border border-gray-300 rounded-md"
              placeholder="Descripción"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveClick}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Título con sombra */}
            <span className="font-medium text-gray-800 text-lg dark:text-white shadow-md">
              {task.title}
            </span>
            <p className="text-gray-600 dark:text-gray-300 shadow-sm">
              {task.description}
            </p>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex space-x-4">
          <i
            className="pi pi-pencil text-blue-500 text-xl cursor-pointer hover:text-blue-700"
            onClick={handleEditClick}
            title="Editar"
          ></i>
          <i
            className="pi pi-trash text-red-500 text-xl cursor-pointer hover:text-red-700"
            onClick={handleDeleteClick}
            title="Eliminar"
          ></i>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
