const barang = Array.from({ length: 100 }, (_, i) => {
  const index = i + 1;

  return {
    id: index,
    nama: `Barang ${index}`,
    harga: 5000 + index * 1000, // harga bertahap
    stok: Math.floor(Math.random() * 100) + 1 // stok 1 - 100
  };
});

export default barang;
