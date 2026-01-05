const host = "http://localhost:8000/api";


// ===============================
// LOGIN
// ===============================
export async function checkUser(id, password) {
    const res = await fetch(`${host}/yeslocal/login/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        password: password
      }),
    });
  
    return res.json();
  }

// ===============================
// LOGOUT
// ===============================
export async function logoutUser(login_session_id) {
    const res = await fetch(`${host}/yeslocal/login/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login_session_id: login_session_id
      }),
    });
  
    return res.json();
  }

// ===============================
// LIST SATUAN
// ===============================
export async function getListSatuan() {
  const res = await fetch(`${host}/yeslocal/cashier/list-satuan`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

// ===============================
// CASHIER - GET ITEM
// ===============================
export async function getCashierItem(payload) {
  const res = await fetch(`${host}/yeslocal/cashier/get-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}


// ===============================
// CASHIER - Transaksi
// ===============================
export async function bayarTransaksi(payload) {
  const res = await fetch(`${host}/yeslocal/cashier/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

// ===============================
// CEK MEMBER
// ===============================
export async function cekMember(no_member) {
    const res = await fetch(`${host}/yeslocal/cashier/get_member`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ no_member }),
    });

    // optional safety
    if (!res.ok) {
        throw new Error("Gagal cek member");
    }

    return await res.json();
}

