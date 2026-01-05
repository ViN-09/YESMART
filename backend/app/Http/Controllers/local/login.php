<?php

namespace App\Http\Controllers\local;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class login extends Controller
{
    protected $connection = 'mysql';

    // ==========================================
    // FUNGSI: AMBIL user_bio
    // ==========================================
    private function getUserBioByD($id)
{
    // Ambil data user_bio
    $userBio = DB::connection($this->connection)
        ->table('user_bio')
        ->where('id', $id)
        ->first();

    // Ambil HISTORY LOGIN terakhir berdasarkan user
    $lastLogin = DB::connection($this->connection)
        ->table('dafta_login')
        ->where('user', $id)
        ->orderBy('id', 'DESC')
        ->first();

    // Gabungkan hasil
    return $login_info= [
            "idUser"             => $userBio?->id,
            "login_session"  => $lastLogin?->id,
    ];
        // Kalau mau kembalikan full data tinggal buka saja:
        // "user_bio"   => $userBio,
        // "last_login" => $lastLogin
}



    // ==========================================
    // FUNGSI: LOG ACTIVITY
    // ==========================================
    private function logActivity($userId, $activity)
    {
        DB::connection($this->connection)
            ->table('log_activity')
            ->insert([
                "user"         => $userId,
                "activity_log" => $activity,
                "date_time"    => Carbon::now('Asia/Makassar'),
            ]);
    }

    // ==========================================
    // FUNGSI: CATAT DAFTAR LOGIN
    // ==========================================
    private function insertDaftarLogin($userId)
    {
        DB::connection($this->connection)
            ->table('dafta_login')
            ->insert([
                "user"      => $userId,
                "date_time" => Carbon::now('Asia/Makassar'),
            ]);
    }

    public function generatePassword($password)
    {
        $hash = Hash::make($password);

        return response()->json([
            "password" => $password,
            "hash" => $hash,
        ]);
    }

    // ==========================================
    // VERIFIKASI LOGIN + LOG + DAFTAR LOGIN
    // ==========================================
    public function verifyLogin(Request $request)
    {
        $id = $request->post('id');
        $password = $request->post('password');

        if (empty($id) || empty($password)) {
            return response()->json([
                "status" => false,
                "message" => "Parameter 'id' dan 'password' wajib diisi"
            ], 400);
        }

        $user = DB::connection($this->connection)
            ->table('user_data')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return response()->json([
                "status" => false,
                "message" => "User tidak ditemukan"
            ], 404);
        }

        if (!Hash::check($password, $user->password)) {
            return response()->json([
                "status" => false,
                "message" => "Password salah"
            ], 401);
        }

        // AMBIL user_bio
        
        // ==========================================
        // PANGGIL FUNGSI LOG LOGIN
        // ==========================================
        $this->logActivity($id, "Login berhasil");
        
        // ==========================================
        // PANGGIL FUNGSI CATAT DAFTAR LOGIN
        // ==========================================
        $this->insertDaftarLogin($id);
        
        $userBio = $this->getUserBioByD($id);
        
        return response()->json([
            "status"    => true,
            "message"   => "Login berhasil",
            "login_info"  => $userBio
        ]);
    }

    public function logout(Request $request)
{
    $loginSessionId = $request->post('login_session_id');

    if (empty($loginSessionId)) {
        return response()->json([
            "status" => false,
            "message" => "Parameter 'id' wajib diisi"
        ], 400);
    }

    // Update kolom logout pada baris dafta_login berdasarkan id
    DB::connection($this->connection)
        ->table('dafta_login')
        ->where('id', $loginSessionId)
        ->update([
            "logout" => Carbon::now('Asia/Makassar')
        ]);

    return response()->json([
        "status"  => true,
        "message" => "Logout berhasil"
    ]);
}

}
