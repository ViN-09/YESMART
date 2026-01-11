import { useState } from "react";
import "./Sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar({ onSelectMenu }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("Home");

    const menu = [
        { label: "Home", icon: "bi-house" },
        { label: "Barang", icon: "bi-box" },
        { label: "Inbox", icon: "bi-inbox" },
        { label: "Calendar", icon: "bi-calendar-event" },
        { label: "Search", icon: "bi-search" },
        { label: "Settings", icon: "bi-gear" },
    ];

    const handleSelect = (item) => {
        setActive(item.label);
        onSelectMenu(item.label);
        setOpen(false);
    };

    return (
        <div className="main-sidebar">
            {/* ICON BAR */}
            <aside className="sidebar-icon">
                <button className="menu-btn" onClick={() => setOpen(true)}>
                    <i className="bi bi-list" />
                </button>

                {menu.map((item, i) => (
                    <div
                        key={i}
                        className={`icon-item ${active === item.label ? "active" : ""}`}
                        onClick={() => handleSelect(item)}
                    >
                        <i className={`bi ${item.icon}`} />
                    </div>
                ))}
            </aside>

            {/* OVERLAY */}
            <div
                className={`sidebar-overlay ${open ? "show" : ""}`}
                onClick={() => setOpen(false)}
            />

            {/* SLIDE SIDEBAR */}
            <aside className={`sidebar-slide ${open ? "open" : ""}`}>
                <div className="sidebar-header">
                    <span>Application</span>
                    <i
                        className="bi bi-x-lg close-btn"
                        onClick={() => setOpen(false)}
                    />
                </div>

                <ul className="sidebar-menu">
                    {menu.map((item, i) => (
                        <li
                            key={i}
                            className={active === item.label ? "active" : ""}
                            onClick={() => handleSelect(item)}
                        >
                            <i className={`bi ${item.icon}`} />
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
