<?php

namespace App\Http\Controllers\local;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class casir extends Controller
{
    protected $connection = 'mysql';

    private function logActivity($userId, $activity)
    {
        DB::connection($this->connection)
            ->table('log_activity')
            ->insert([
                "user" => $userId,
                "activity_log" => $activity,
                "date_time" => Carbon::now('Asia/Makassar'),
            ]);
    }

    public function getListSatuan()
    {
        $satuan = DB::connection($this->connection)
            ->table('barang')
            ->select('satuanbeli as satuan')
            ->whereNotNull('satuanbeli')
            ->where('satuanbeli', '!=', '')
            ->union(
                DB::connection($this->connection)
                    ->table('barang')
                    ->select('satuan')
                    ->whereNotNull('satuan')
                    ->where('satuan', '!=', '')
            )
            ->orderBy('satuan')
            ->pluck('satuan');

        return response()->json([
            'status' => true,
            'data' => $satuan
        ]);
    }


    public function get_item(Request $request)
    {
        // ===============================
        // VALIDASI INPUT
        // ===============================
        $request->validate([
            'kode_barcode' => 'required|string',
            'satuan' => 'required|string',
            'jumlah' => 'required|numeric|min:1',
        ]);

        // ===============================
        // AMBIL DATA BARANG
        // ===============================
        $barang = DB::connection($this->connection)
            ->table('barang')
            ->where('kode_barcode', $request->kode_barcode)
            ->select('kode_barcode', 'nama', 'satuanbeli', 'harga_toko', 'satuan', 'harga_satuan1', )
            ->first();

        // ===============================
        // JIKA BARANG TIDAK DITEMUKAN
        // ===============================
        if (!$barang) {
            return response()->json([
                'status' => false,
                'message' => 'Barang tidak ditemukan'
            ], 404);
        }

        if ($request['satuan'] === $barang->satuanbeli) {
            $harga_final = $barang->harga_toko;
        } elseif ($request['satuan'] === $barang->satuan) {
            $harga_final = $barang->harga_satuan1;
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Satuan tidak valid'
            ], 400);
        }


        // ===============================
        // HITUNG TOTAL
        // ===============================
        $total = $harga_final * $request->jumlah;

        // ===============================
        // RESPONSE
        // ===============================
        return response()->json([
            'status' => true,
            'data' => [
                'kode_barcode' => $barang->kode_barcode,
                'nama' => $barang->nama,
                'harga' => $harga_final,
                'satuan' => $request->satuan,
                'jumlah' => $request->jumlah,
                'subtotal' => $total
            ]
        ]);
    }

    public function payment(Request $request)
{
    return response()->json([
        'status' => true,
        'message' => 'Pembayaran berhasil',
        'data' => $request->all()
    ], 200);
}

public function get_member(Request $request)
{
    try {
        $request->validate([
            'no_member' => 'required|string'
        ]);

        $member = DB::table('member_id')
            ->where('id', $request->no_member)
            ->first();

        if (!$member) {
            return response()->json([
                'status'  => false,
                'message' => 'Member tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Member valid',
            'data'    => $member
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'status'  => false,
            'message' => 'No member wajib diisi'
        ], 422);

    } catch (\Exception $e) {
        return response()->json([
            'status'  => false,
            'message' => 'Terjadi kesalahan server',
            'error'   => $e->getMessage()
        ], 500);
    }
}





}
