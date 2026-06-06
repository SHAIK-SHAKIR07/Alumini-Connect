import { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa"
import Menu from '../Menu';
import Logo from '../../components/Logo';
function TopNavbar()
{
      const [showMenu, setShowMenu] = useState(false);
       const [showProfileDropdown, setShowProfileDropdown] = useState(false);
        const handleLogout = () => {
    localStorage.clear();
    navigate('/aluminilogin');
  };
    return(
        <>
          <Menu isOpen={showMenu} onClose={() => setShowMenu(false)} />
        <header className="al-navbar">
          <div className="al-navbar-left">
            <FaBars className="nav-icon" onClick={() => setShowMenu(true)} />
            <Logo text="Alumni Portal" src="/image.png" />
          </div>
          <div className="nav-title">Alumni Dashboard</div>
          <div className="profile-dropdown">
          <FaUserCircle
            className="nav-icon"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          {showProfileDropdown && (
            <div className="dropdown-menu">
              <a href='/profil'><button>Edit Profile</button></a>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
        </>
    )
}
export default TopNavbar