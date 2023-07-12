export default function Navbar() {
    return (
        <nav className="relative flex items-center">     
            <a href="/create" className="nav-btn-create">
                <i className="mr-2 fa-solid fa-plus fa-xs"></i>Create a new game
            </a>           
            <a href="/" className="absolute -translate-x-1/2 left-1/2">
                <img className="h-6" src="/logo.png" />   
            </a>
        </nav>
    );
};