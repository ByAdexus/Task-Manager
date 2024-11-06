import { InputText } from 'primereact/inputtext'; 
import 'primeicons/primeicons.css';

function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md relative z-20 pl-64"> {/* pl-64 para que el header no se sobreponga al sidebar */}
      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-2 w-1/3">
        <InputText
          className="p-2 w-full border border-gray-300 rounded-lg"
          placeholder="Buscar"
          icon="pi pi-search" // Ícono de lupa de PrimeReact
        />
      </div>

      {/* Botones en el lado derecho */}
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black">
          <i className="pi pi-plus mr-2 text-black"></i> Add Task
        </button>
        <button className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black">
          <i className="pi pi-bell"></i>
        </button>
      </div>
    </header>
  );
}

export default Header;

