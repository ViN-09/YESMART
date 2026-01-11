import { useState } from "react";
import Sidebar from "./component/Sidebar";
import "./POSpage.css";
import Barang from "./Page/Barang/Barang";



function POSpage() {
    const [title, setTitle] = useState("Home");

    return (
        <div className="pos-wrapper">
            <div className="pos-sidebar">
                <Sidebar onSelectMenu={setTitle} />
            </div>

            <div className="pos-content">
                <h1 key={title} className="page-title">
                    {title}
                </h1>
                <Barang/>
            </div>
        </div>
    );
}

export default POSpage;
