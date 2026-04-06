<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->string('ip_address')->nullable()->after('user_id');
            $table->unsignedBigInteger('user_id')->nullable()->change();
            
            // Drop old unique constraint if you want, but for now we'll just handle logic in controller
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->dropColumn('ip_address');
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
