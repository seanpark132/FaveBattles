export default function Navbar() {
    return (
        <div className="nav">  
            <div className="nav-wrapper">         
                <a href="/home" className="nav-btn-home">
                    <i className="btn-icon fa-solid fa-house fa-xs"/>Home
                </a>                     
                <a href="/create" className="nav-btn-create">
                    <i className="btn-icon fa-solid fa-plus fa-xs"></i>Create a new game
                </a>           
                <img className="logo" src="/logo.png" />           
            </div>
        </div>
    )
}