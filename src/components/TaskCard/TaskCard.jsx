import React, { useState } from 'react';
import { editTask, deleteTask } from '../../services/storageService';

function TaskCard({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: task.title, description: task.description });

  const handleEditClick = () => {
    setIsEditing(true); // Muestra el modal de edición
  };

  const handleSaveClick = async () => {
    await editTask(task.id, editedTask); // Llama a la función editTask de storageService.js
    setIsEditing(false); // Cierra el modal después de guardar
  };

  const handleDeleteClick = async () => {
    await deleteTask(task.id); // Llama a la función deleteTask de storageService.js
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center mb-4 transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl
    dark:bg-indigo-900 ">
      <div className="flex flex-col">
        <span className="font-medium text-gray-800 text-lg dark:text-white">{task.title}</span>
        {task.description && <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">{task.description}</p>}
      </div>
      
      <div className="flex space-x-2">
        <button onClick={handleEditClick} className="text-blue-500 hover:text-blue-700 p-2 rounded-full">
          <i className="pi pi-pencil"></i> {/* Icono de edición */}
        </button>
        <button onClick={handleDeleteClick} className="text-red-500 hover:text-red-700 p-2 rounded-full">
          <i className="pi pi-trash"></i> {/* Icono de eliminación */}
        </button>
      </div>
      
      <div className='rounded' style={{ backgroundColor: `${task.color}69` }}>
        <p className="text-xl text-center text">.</p>
      </div>

      {/* Modal de edición */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-900 text-black dark:text-white">
            <h2 className="text-xl font-bold mb-4 ">Editar Tarea</h2>
            
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="border p-2 mb-2 w-full rounded dark:text-black"
              placeholder="Título de la tarea"
            />
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="border p-2 mb-2 w-full rounded dark:text-black"
              placeholder="Descripción de la tarea"
            />

            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:text-black">
                Cancelar
              </button>
              <button onClick={handleSaveClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
