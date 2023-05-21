export default function Navbar() {
    return (
        <nav>  
            <div className="relative flex items-center">         
                <a href="/home" className="nav-btn-home">
                    <i className="btn-icon fa-solid fa-house fa-xs"/>Home
                </a>                     
                <a href="/create" className="nav-btn-create">
                    <i className="btn-icon fa-solid fa-plus fa-xs"></i>Create a new game
                </a>           
                <img className="centered h-7" src="/logo.png" />           
            </div>
        </nav>
    );
};