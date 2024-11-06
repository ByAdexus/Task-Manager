import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Importamos las funciones necesarias para drag-and-drop
import TaskCard from '../TaskCard/TaskCard';

const initialData = {
  tasks: {
    "1": { id: "1", title: "Diseñar interfaz", description: "Diseñar la UI del proyecto", category: "Por hacer" },
    "2": { id: "2", title: "Desarrollar API", description: "Desarrollar la API de la aplicación", category: "Haciendo" },
    "3": { id: "3", title: "Escribir documentación", description: "Documentar el código", category: "Importantes" },
  },
  columns: {
    "porHacer": { id: "porHacer", title: "Por hacer", taskIds: ["1", "2"] },
    "haciendo": { id: "haciendo", title: "Haciendo", taskIds: ["2"] },
    "importantes": { id: "importantes", title: "Importantes", taskIds: ["3"] },
  },
  columnOrder: ["porHacer", "haciendo", "importantes"],
};

function KanbanBoard() {
  const [data, setData] = useState(initialData);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // Si no se ha movido a ningún lugar, salimos
    if (!destination) return;

    // Si la columna de origen y destino es la misma, no hacemos nada
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Hacer una copia de los elementos y actualizar el estado
    const newColumns = { ...data.columns };
    const sourceColumn = newColumns[source.droppableId];
    const destinationColumn = newColumns[destination.droppableId];

    // Mover la tarea de la columna de origen a la columna de destino
    const [removed] = sourceColumn.taskIds.splice(source.index, 1);
    destinationColumn.taskIds.splice(destination.index, 0, removed);

    // Actualizamos el estado de las columnas
    setData({ ...data, columns: newColumns });
  };

  const handleCategoryEdit = (columnId) => {
    setEditingCategory(columnId);
    setNewCategoryTitle(data.columns[columnId].title); // Prellenamos el nuevo título con el actual
  };

  const handleCategorySave = (columnId) => {
    const newColumns = { ...data.columns };
    newColumns[columnId].title = newCategoryTitle; // Actualizamos el título de la columna
    setData({ ...data, columns: newColumns });
    setEditingCategory(null); // Salimos del modo de edición
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex p-6 space-x-4 ml-64"> {/* Aseguramos un margen izquierdo para evitar superposición con el Sidebar */}
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-lg w-80"
                  style={{ minHeight: '300px' }}
                >
                  {/* Categoría editable */}
                  <div className="flex justify-between items-center mb-2">
                    {editingCategory === column.id ? (
                      <input
                        type="text"
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        className="p-2 border-b border-gray-300 focus:outline-none"
                      />
                    ) : (
                      <h2 className="font-semibold text-lg text-gray-700">{column.title}</h2>
                    )}

                    {/* Botón de editar categoría */}
                    {editingCategory === column.id ? (
                      <button
                        onClick={() => handleCategorySave(column.id)} // Guardar el nuevo título
                        className="text-gray-500 ml-2"
                      >
                        <i className="pi pi-check-circle" /> {/* Ícono de guardar */}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCategoryEdit(column.id)} // Iniciar la edición
                        className="text-gray-500 ml-2"
                      >
                        <i className="pi pi-pencil" /> {/* Ícono de editar */}
                      </button>
                    )}
                  </div>

                  {/* Línea separadora entre categorías y tareas */}
                  <hr className="border-t-2 border-gray-300 mb-4" />

                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 rounded-lg shadow-md mb-4 transform transition-all hover:scale-105"
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;
