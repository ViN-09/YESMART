import React from "react";
import watermark from "./assets/Gemini_Generated_Image_gtab1ngtab1ngtab.png"; // sesuaikan path-nya

function Struk({ data, no_struk }) {
    if (!data) return null;

    return (
        <div style={{ 
            position: "relative", 
            textAlign: "left", 
            padding: "20px",
            backgroundColor: "#fff"
        }}>
            {/* WATERMARK */}
            <img 
                src={watermark} 
                alt="Watermark" 
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    opacity: 0.1,
                    width: "80%", // sesuaikan ukuran
                    zIndex: 0,
                    pointerEvents: "none" // supaya gak ganggu klik
                }}
            />

            {/* CONTENT */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <p><b>No Struk:</b> {no_struk}</p>

                {data.member?.id && (
                    <p><b>Member:</b> {data.member.id.toLocaleString()}</p>
                )}

                <p><b>Total:</b> Rp {data.total.toLocaleString()}</p>

                <p><b>Metode:</b> {
                    data.pembayaran === "cash" ? "Cash" :
                    data.pembayaran === "e-money" ? "E-Money" :
                    "Point"
                }</p>

                {data.pembayaran === "cash" && (
                    <>
                        <p><b>Tunai:</b> Rp {data.tunai.toLocaleString()}</p>
                        <p><b>Kembalian:</b> Rp {data.kembalian.toLocaleString()}</p>
                    </>
                )}

                {data.pembayaran === "point" && (
                    <p><b>Point Digunakan:</b> {data.point_dipakai}</p>
                )}

                <hr />

                <b>Item:</b>
                <ul>
                    {data.items?.map((item, i) => (
                        <li key={i}>
                            {item.nama} × {item.qty}
                            <br />
                            Rp {item.subtotal.toLocaleString()}
                        </li>
                    ))}
                </ul>

                {data.member?.id && (
                    <>
                        <hr />
                        <p style={{ textAlign: "center" }}>
                            Terima kasih 🙏  
                            <br />
                            Member #{data.member.nama}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Struk;
