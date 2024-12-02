import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getAllProjects } from '../..//services/storageService';
import { useFirebaseContext } from '../../services/FirebaseContext';

const Productivity = () => {
  const [chartData, setChartData] = useState([]);
  const [barData, setBarData] = useState([]);
  const { seed } = useFirebaseContext();
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProjects(seed);
      const { projects, projectOrder, tasks } = data;

      // Contar el total de tareas en todos los proyectos
      const totalTasks = Object.keys(tasks).length;

      if (totalTasks === 0) {
        setChartData([]);
        setBarData([]);
        return;
      }

      const colors = [
        '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', 
        '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'
      ];

      const chartData = projectOrder.map((projectId, index) => {
        const project = projects[projectId];
        const taskIds = project.taskIds || [];

        return {
          name: project.title,
          uv: (taskIds.length / totalTasks) * 100,  // Proporcional al total de tareas
          pv: 100,                                  // Total de 100% para normalizar
          fill: colors[index % colors.length],
        };
      });

      // Preparar los datos para los gráficos de barras sin normalización
      const barData = projectOrder.map((projectId, index) => {
        const project = projects[projectId];
        const taskIds = project.taskIds || [];

        return {
          name: project.title,
          uv: taskIds.length,
          pv: totalTasks,
        };
      });

      setChartData(chartData);
      setBarData(barData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center space-y-8">
      {/* Gráfico Radial */}
      <div className="w-full h-96 flex justify-center items-center">
        <ResponsiveContainer width="50%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={chartData}>
            <RadialBar
              minAngle={5}
              label={{ position: 'insideStart', fill: '#fff', formatter: (value) => `${value.toFixed(1)}%` }}
              background
              clockWise
              dataKey="uv"
            />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: '50%', right: 0, transform: 'translate(0, -50%)', lineHeight: '24px' }} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos de Barras en una Fila */}
      <div className="w-full flex justify-center space-x-8">
        {/* Primer Gráfico de Barras */}
        <div className="w-1/2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={barData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={20}
            >
              <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="uv" fill="#8884d8" background={{ fill: '#eee' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Productivity;
