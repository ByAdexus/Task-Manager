function Header() {
    return (
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-100 p-2 rounded w-1/3"
        />
        <div className="flex items-center space-x-4">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">+ New task</button>
          <span className="material-icons">mail</span>
          <span className="material-icons">account_circle</span>
        </div>
      </header>
    );
  }
  
  export default Header;
  