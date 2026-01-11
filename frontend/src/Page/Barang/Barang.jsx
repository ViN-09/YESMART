import React, { useState } from "react";
import barang from "./api_barang";
import "./Barang.css";

function Barang() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(barang.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = barang.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="barang-container">

      {/* Header + Action */}
      <div className="barang-header">
        <h2>Daftar Barang</h2>

        <div className="barang-actions">
          <input
            type="text"
            placeholder="Cari barang..."
            disabled
          />

          <button className="btn-cari" disabled>
            Cari
          </button>

          <button className="btn-tambah" disabled>
            + Tambah Barang
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="barang-table-wrapper">
        <table className="barang-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Harga</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={item.id}>
                <td>{startIndex + index + 1}</td>
                <td>{item.nama}</td>
                <td>Rp {item.harga.toLocaleString()}</td>
                <td>{item.stok}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default Barang;
