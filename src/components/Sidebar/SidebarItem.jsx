function SidebarItem({ text, active }) {
    return (
      <div className={`p-2 rounded ${active ? 'bg-yellow-200' : 'hover:bg-gray-200'}`}>
        <span>{text}</span>
      </div>
    );
  }
  
  export default SidebarItem;
  