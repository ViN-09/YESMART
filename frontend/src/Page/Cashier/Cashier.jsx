import { useEffect, useState, useCallback, useMemo } from "react";
import {
    getListSatuan,
    getCashierItem,
    bayarTransaksi,
    cekMember
} from "../../API";
import ButtonRoute from "../../ButtonRoute";
import './Colorpalet.css'
import "./Cashier.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Struk from "../../Struk";
import Swal from "sweetalert2";
import ReactDOMServer from "react-dom/server";

function Cashier() {
    const [listSatuan, setListSatuan] = useState([]);
    const [cart, setCart] = useState([]);
    const [no_member, setNo_member] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [form, setForm] = useState({
        kode_barcode: "",
        satuan: "PCs",
        jumlah: 1,
    });

    // ===============================
    // FETCH LIST SATUAN - Optimized
    // ===============================
    useEffect(() => {
        const fetchSatuan = async () => {
            try {
                const res = await getListSatuan();
                if (res?.status) {
                    setListSatuan(res.data || []);
                }
            } catch (err) {
                console.error("Gagal load satuan:", err);
                setListSatuan(["PCs"]); // Fallback default
            }
        };
        fetchSatuan();
    }, []);

    // ===============================
    // TOTAL CALCULATION - Optimized with useMemo
    // ===============================
    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    }, [cart]);

    // ===============================
    // HANDLE FORM CHANGE - Optimized
    // ===============================
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? Math.max(1, Number(value) || 1) : value
        }));
    };

    // ===============================
    // ADD TO CART - Optimized
    // ===============================
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.kode_barcode.trim()) {
            Swal.fire("Peringatan", "Masukkan kode barcode/nama barang", "warning");
            return;
        }

        try {
            setIsProcessing(true);
            const result = await getCashierItem(form);

            if (!result?.status) {
                Swal.fire("Gagal", result?.message || "Barang tidak ditemukan", "error");
                return;
            }

            const item = result.data;
            const harga = parseFloat(item.harga) || 0;
            const jumlah = Math.max(1, form.jumlah);
            const subtotal = harga * jumlah;

            setCart(prevCart => {
                const existingIndex = prevCart.findIndex(
                    i => i.kode_barcode === item.kode_barcode && i.satuan === form.satuan
                );

                if (existingIndex > -1) {
                    const newCart = [...prevCart];
                    const existingItem = newCart[existingIndex];
                    const newQty = existingItem.qty + jumlah;
                    
                    newCart[existingIndex] = {
                        ...existingItem,
                        qty: newQty,
                        subtotal: harga * newQty
                    };
                    return newCart;
                }

                return [...prevCart, {
                    kode_barcode: item.kode_barcode,
                    nama: item.nama,
                    satuan: form.satuan,
                    harga: harga,
                    qty: jumlah,
                    subtotal: subtotal
                }];
            });

            // Reset form but keep satuan
            setForm(prev => ({
                ...prev,
                kode_barcode: "",
                jumlah: 1
            }));

            // Auto focus kembali ke input barcode
            document.querySelector('input[name="kode_barcode"]')?.focus();

        } catch (err) {
            console.error("Error tambah barang:", err);
            Swal.fire("Error", "Gagal menghubungi server", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    // ===============================
    // REMOVE ITEM - Optimized
    // ===============================
    const removeItem = useCallback((index) => {
        setCart(prev => {
            const newCart = [...prev];
            newCart.splice(index, 1);
            return newCart;
        });
    }, []);

    // ===============================
    // CHECK MEMBER - Optimized
    // ===============================
    const checkMember = async (memberId) => {
    if (!memberId?.trim()) return null;

    try {
        const res = await cekMember(memberId.trim());

        if (!res?.status) {
            Swal.fire(
                "Member Tidak Valid",
                res?.message || "Member tidak ditemukan",
                "error"
            );
            return null;
        }

        // 🔥 data LANGSUNG OBJECT
        return res.data;

    } catch (err) {
        console.error("Error cek member:", err);
        Swal.fire("Error", "Gagal memverifikasi member", "error");
        return null;
    }
};

const printStruk = (html) => {
    const printWindow = window.open("", "_blank", "width=400,height=600");

    printWindow.document.write(`
        <html>
            <head>
                <title>Struk Pembayaran</title>
                <style>
                    body {
                        font-family: monospace;
                        font-size: 12px;
                        padding: 10px;
                         width: 58mm;
                    }
                    hr {
                        border: 1px dashed #000;
                    }
                </style>
            </head>
            <body>
                ${html}
                <script>
                    window.onload = function () {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
        </html>
    `);

    printWindow.document.close();
};


    // ===============================
    // PROCESS PAYMENT - Optimized
    // ===============================
    const processPayment = async (payload) => {
        console.log("PAYLOAD BAYAR:", payload);
    
        try {
            const res = await bayarTransaksi(payload);
    
            if (!res?.status) {
                throw new Error(res?.message || "Pembayaran gagal");
            }
    
            const data = res.data;
    
            // ⬇️ RENDER STRUK JSX KE HTML STRING
            const strukHTML = ReactDOMServer.renderToString(
                <Struk data={data} no_struk={res.no_struk} />
            );
    
            const result = await Swal.fire({
                icon: "success",
                title: "Pembayaran Berhasil",
                html: strukHTML,
                confirmButtonText: "Cetak Struk"
            });
            
            if (result.isConfirmed) {
                printStruk(strukHTML);
            }
    
            setCart([]);
            setNo_member(null);
            setForm(prev => ({ ...prev, kode_barcode: "" }));
    
        } catch (err) {
            console.error("ERROR BAYAR:", err);
            const message = err?.message || "Terjadi kesalahan saat pembayaran";
    
            await Swal.fire({
                icon: "error",
                title: "Pembayaran Gagal",
                text: message,
                confirmButtonText: "OK"
            });
    
            throw err;
        }
    };
    
    

    // ===============================
    // HANDLE PAYMENT - Major Optimization
    // ===============================
    const handleBayar = async () => {
        if (cart.length === 0) {
            Swal.fire("Keranjang Kosong", "Tambahkan barang terlebih dahulu", "info");
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            // Step 1: Input Member
            const { value: memberInput, isConfirmed: memberConfirmed } = await Swal.fire({
                title: "Nomor Member",
                input: "text",
                inputPlaceholder: "Masukkan nomor member (kosongkan jika tidak ada)",
                showCancelButton: true,
                confirmButtonText: "Lanjut",
                cancelButtonText: "Batal",
                inputValidator: (value) => {
                    if (value && !/^\d+$/.test(value.trim())) {
                        return "Nomor member harus angka";
                    }
                    return null;
                }
            });

            if (!memberConfirmed) {
                setIsProcessing(false);
                return;
            }

            // Step 2: Validate Member
            let memberData = null;
            const trimmedMember = memberInput?.trim();
            
            if (trimmedMember) {
                memberData = await checkMember(trimmedMember);
                if (!memberData) {
                    setIsProcessing(false);
                    return;
                }
                setNo_member(trimmedMember);
            } else {
                setNo_member(null);
            }

            // Step 3: Payment Method
            const paymentOptions = {
                cash: "Cash",
                emoney: "E-Money"
            };

            if (memberData?.point && memberData.point >= total) {
                paymentOptions.point = `Point (Saldo: ${memberData.point})`;
            }

            const { value: paymentMethod } = await Swal.fire({
                title: "Pilih Metode Pembayaran",
                icon: "question",
                input: "radio",
                inputOptions: paymentOptions,
                inputValidator: (value) => !value ? "Pilih metode pembayaran" : null,
                confirmButtonText: "Lanjut",
                showCancelButton: true
            });

            if (!paymentMethod) {
                setIsProcessing(false);
                return;
            }

            // Base payload
            const basePayload = {
                total: total,
                items: cart.map(item => ({
                    ...item,
                    harga: parseFloat(item.harga),
                    subtotal: parseFloat(item.subtotal)
                })),
                no_member: trimmedMember || null,
                member: memberData || null
            };

            // Step 4: Process based on payment method
            switch (paymentMethod) {
                case 'cash':
                    const { value: cashAmount } = await Swal.fire({
                        title: "Pembayaran Cash",
                        input: "number",
                        inputLabel: `Total: Rp ${total.toLocaleString()}`,
                        inputPlaceholder: "Masukkan jumlah uang",
                        inputAttributes: { 
                            min: total,
                            step: "100"
                        },
                        inputValidator: (value) => {
                            const amount = parseFloat(value);
                            if (!amount) return "Masukkan jumlah uang";
                            if (amount < total) return `Minimal Rp ${total.toLocaleString()}`;
                            return null;
                        },
                        confirmButtonText: "Proses",
                        showCancelButton: true
                    });

                    if (!cashAmount) {
                        setIsProcessing(false);
                        return;
                    }

                    await processPayment({
                        ...basePayload,
                        pembayaran: "cash",
                        tunai: parseFloat(cashAmount),
                        kembalian: parseFloat(cashAmount) - total
                    });
                    break;

                case 'emoney':
                    await processPayment({
                        ...basePayload,
                        pembayaran: "e-money"
                    });
                    break;

                case 'point':
                    if (!memberData || memberData.point < total) {
                        Swal.fire(
                            "Point Tidak Cukup",
                            `Saldo point: ${memberData?.point || 0}, Dibutuhkan: ${total}`,
                            "error"
                        );
                        setIsProcessing(false);
                        return;
                    }

                    const { isConfirmed: confirmPoint } = await Swal.fire({
                        title: "Konfirmasi",
                        text: `Gunakan ${total} point untuk pembayaran?`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Ya, Gunakan Point",
                        cancelButtonText: "Batal"
                    });

                    if (!confirmPoint) {
                        setIsProcessing(false);
                        return;
                    }

                    await processPayment({
                        ...basePayload,
                        pembayaran: "point",
                        point_dipakai: total
                    });
                    break;

                default:
                    break;
            }

        } catch (err) {
            console.error("Payment process error:", err);
            // Error sudah dihandle di processPayment
        } finally {
            setIsProcessing(false);
        }
    };

    // ===============================
    // KEYBOARD SHORTCUTS
    // ===============================
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F2' || (e.ctrlKey && e.key === 'Enter')) {
                e.preventDefault();
                document.querySelector('button[type="submit"]')?.click();
            }
            if (e.key === 'F3' && cart.length > 0 && !isProcessing) {
                e.preventDefault();
                handleBayar();
            }
            if (e.key === 'Escape' && cart.length > 0) {
                e.preventDefault();
                const { value: confirmed } = Swal.fire({
                    title: "Hapus Semua?",
                    text: "Yakin ingin mengosongkan keranjang?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Ya, Hapus",
                    cancelButtonText: "Batal"
                });
                if (confirmed) setCart([]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart.length, isProcessing]);

    return (
        
        <div id="cashier-page">
            
            {/* HEADER */}
            <div id="header-section">
                <h1>YESMART</h1>
                {no_member && (
                    <div className="member-badge">
                        Member: {no_member}
                    </div>
                )}
            </div>

            {/* TOP SECTION */}
            <div id="top-section">
                <form id="input-section" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nama / Barcode</label>
                        <input
                            type="text"
                            name="kode_barcode"
                            value={form.kode_barcode}
                            onChange={handleChange}
                            autoFocus
                            required
                            disabled={isProcessing}
                            placeholder="Scan atau ketik barcode"
                        />
                    </div>

                    <div className="input-group">
                        <label>Satuan</label>
                        <select
                            name="satuan"
                            value={form.satuan}
                            onChange={handleChange}
                            disabled={isProcessing}
                        >
                            {listSatuan.map((s, i) => (
                                <option key={i} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Jumlah</label>
                        <input
                            type="number"
                            name="jumlah"
                            min="1"
                            step="1"
                            value={form.jumlah}
                            onChange={handleChange}
                            disabled={isProcessing}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-add"
                        disabled={isProcessing || !form.kode_barcode.trim()}
                    >
                        <i className="bi bi-plus-circle"></i> 
                        {isProcessing ? "Memproses..." : "Tambah (F2)"}
                    </button>
                </form>

                <div id="total-section">
                    <h2>Total Bayar</h2>
                    <h1>Rp {total.toLocaleString()}</h1>
                    <div className="item-count">
                        {cart.length} item
                    </div>
                </div>
            </div>

            {/* CART SECTION */}
            <div id="chart-section">
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Satuan</th>
                            <th>Harga</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-cart">
                                    <i className="bi bi-cart"></i>
                                    <br />
                                    Keranjang kosong
                                </td>
                            </tr>
                        ) : (
                            cart.map((item, idx) => (
                                <tr key={`${item.kode_barcode}-${item.satuan}-${idx}`}>
                                    <td>{item.nama}</td>
                                    <td>{item.satuan}</td>
                                    <td>Rp {item.harga.toLocaleString()}</td>
                                    <td>
                                        <div className="qty-control">
                                            <button 
                                                className="qty-btn"
                                                onClick={() => {
                                                    if (item.qty > 1) {
                                                        const newCart = [...cart];
                                                        newCart[idx] = {
                                                            ...item,
                                                            qty: item.qty - 1,
                                                            subtotal: item.harga * (item.qty - 1)
                                                        };
                                                        setCart(newCart);
                                                    }
                                                }}
                                            >-</button>
                                            <span>{item.qty}</span>
                                            <button 
                                                className="qty-btn"
                                                onClick={() => {
                                                    const newCart = [...cart];
                                                    newCart[idx] = {
                                                        ...item,
                                                        qty: item.qty + 1,
                                                        subtotal: item.harga * (item.qty + 1)
                                                    };
                                                    setCart(newCart);
                                                }}
                                            >+</button>
                                        </div>
                                    </td>
                                    <td>Rp {item.subtotal.toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn-remove"
                                            onClick={() => removeItem(idx)}
                                            title="Hapus item"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAYMENT SECTION */}
            <div id="button-section">
                <button
                    className="btn-pay"
                    onClick={handleBayar}
                    disabled={cart.length === 0 || isProcessing}
                >
                    <i className="bi bi-wallet-fill"></i> 
                    {isProcessing ? "Memproses..." : `Bayar (F3) - Rp ${total.toLocaleString()}`}
                </button>
                
                {cart.length > 0 && (
                    <button
                        className="btn-clear"
                        onClick={() => {
                            Swal.fire({
                                title: "Hapus Semua?",
                                text: "Yakin ingin mengosongkan keranjang?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Ya, Hapus",
                                cancelButtonText: "Batal"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    setCart([]);
                                }
                            });
                        }}
                        disabled={isProcessing}
                    >
                        <i className="bi bi-x-circle"></i> Kosongkan (ESC)
                    </button>
                    
                )}
               
            </div>
            <div className="direrct-back">
            <ButtonRoute
  iconClass="bi bi-arrow-left"
  textColor="#fff"
  route="/home_page"
/>
        </div>
        </div>
        
    );
}

export default Cashier;