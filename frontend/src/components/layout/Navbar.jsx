import React from 'react'

function Navbar({ sidebarOpen, setSidebarOpen }) {
    return (
        <>
            <style>{`
                .navbar {
                    background-color: #E6D7FA;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    width: 100%;
                }

                .navbar-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.8rem 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                    height: 70px;
                }

                /* Left section */
                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .hamburger-btn {
                    background: #9A79BA;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s ease;
                }

                .hamburger-btn:hover {
                    background-color: #7e5a9c;
                }

                .brand {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #9A79BA;
                    text-decoration: none;
                    letter-spacing: 0.5px;
                }

                .brand:hover {
                    color: #7e5a9c;
                }

                /* Desktop navigation */
                .nav-menu-desktop {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    justify-content: center;
                }

                .nav-links {
                    display: flex;
                    list-style: none;
                    gap: 0.5rem;
                    margin: 0;
                    padding: 0;
                }

                .nav-link {
                    color: #A8A2AB;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 0.5rem 1.2rem;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .nav-link:hover {
                    color: #9A79BA;
                    background-color: rgba(154, 121, 186, 0.1);
                }

                .nav-link.active {
                    color: #9A79BA;
                    background-color: rgba(154, 121, 186, 0.15);
                    font-weight: 600;
                }

                .nav-link.disabled {
                    color: #c4b8cf;
                    cursor: not-allowed;
                    pointer-events: none;
                    opacity: 0.6;
                }

                /* Right section */
                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .weather-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #A8A2AB;
                    font-size: 0.9rem;
                    background: rgba(255, 255, 255, 0.7);
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    border: 1px solid rgba(154, 121, 186, 0.2);
                }

                .weather-icon {
                    font-size: 1.2rem;
                }

                .search-btn {
                    background: #9A79BA;
                    color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 20px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    font-size: 0.95rem;
                }

                .search-btn:hover {
                    background-color: #7e5a9c;
                }

                /* Responsive - only showing desktop view */
                @media (max-width: 768px) {
                    .navbar-container {
                        padding: 0.5rem 1rem;
                        height: 60px;
                    }

                    .brand {
                        font-size: 1.2rem;
                    }

                    .hamburger-btn {
                        width: 36px;
                        height: 36px;
                        font-size: 1.3rem;
                    }

                    .nav-menu-desktop {
                        display: none;
                    }

                    .navbar-right {
                        display: none;
                    }
                }
            `}</style>
            
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Left section with hamburger and brand */}
                    <div className="navbar-left">
                        {/* <button 
                            className="hamburger-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            ☰
                        </button> */}
                        <a href="/" className="brand">Smart Booking</a>
                    </div>

                    {/* Desktop Navigation - Center */}
                    <div className="nav-menu-desktop">
                        <ul className="nav-links">
                            <li>
                                <a href="#" className="nav-link active">Home</a>
                            </li>
                            <li>
                                <a href="#" className="nav-link">Services</a>
                            </li>
                            <li>
                                <a href="#" className="nav-link">Login</a>
                            </li>
                            <li>
                                <a href="#" className="nav-link disabled">Profile</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar