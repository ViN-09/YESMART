<?php

namespace App\Http\Controllers\local;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use DateTime;
use DateTimeZone;

class taransaksi extends Controller
{
    protected $connection = 'mysql';

public function payment(Request $request)
{

    return response()->json([
        'status' => true,
        'message' => 'Pembayaran berhasil',
        'no_struk' => $this->create_noStruk(),
        'data' => $request->all()
    ], 200);
}

private function create_noStruk(){
    $kode = 'YES' . (new DateTime('now', new DateTimeZone('Asia/Makassar')))->format('YmdHis');
    return $kode;
}
}

