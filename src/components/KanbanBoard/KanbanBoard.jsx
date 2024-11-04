import ProjectColumn from '../ProjectColumn/ProjectColumn.jsx';

function KanbanBoard() {
  const projects = [
    { id: 1, title: 'Project 1', tasks: [] },
    { id: 2, title: 'Project 2', tasks: [] },
  ];

  return (
    <div className="flex space-x-4 p-4">
      {projects.map(project => (
        <ProjectColumn key={project.id} title={project.title} tasks={project.tasks} />
      ))}
    </div>
  );
}

export default KanbanBoard;
