import React, { useState } from 'react';
import { editTask, deleteTask } from '../../services/storageService';

function TaskCard({ task, updateTaskInState, deleteTaskInState }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: task.title, description: task.description });

  const handleEditClick = () => {
    setIsEditing(true); // Muestra el modal de edición
  };

  const handleSaveClick = async () => {
    const updatedTask = { ...task, ...editedTask };
    await editTask(task.id, updatedTask); // Llama a la función editTask de storageService.js
    updateTaskInState(task.id, updatedTask); // Actualiza el estado global en KanbanBoard
    setIsEditing(false); // Cierra el modal después de guardar
  };

  const handleDeleteClick = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      await deleteTask(task.id); // Llama a la función deleteTask de storageService.js
      deleteTaskInState(task.id); // Elimina la tarea del estado global en KanbanBoard
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center mb-4 transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl dark:bg-indigo-900">
      <div className="flex flex-col w-full">
        {/* Si estamos editando, mostrar el modal de edición */}
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="p-2 mb-2 w-full border border-gray-300 rounded-md"
            />
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="p-2 mb-2 w-full border border-gray-300 rounded-md"
            />
            <div className="flex space-x-2">
              <button onClick={handleSaveClick} className="bg-green-500 text-white p-1 rounded-md">Guardar</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-1 rounded-md">Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <span className="font-medium text-gray-800 text-lg dark:text-white">{task.title}</span>
            <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
          </>
        )}
      </div>

      {/* Los botones solo se muestran cuando no estamos en modo de edición */}
      {!isEditing && (
        <div className="flex space-x-2">
          <button onClick={handleEditClick} className="bg-blue-500 text-white p-1 rounded-md">Editar</button>
          <button onClick={handleDeleteClick} className="bg-red-500 text-white p-1 rounded-md">Eliminar</button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
