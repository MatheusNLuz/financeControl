<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('account_user', function (Blueprint $table) {
           $table->id();
           $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
           $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
           $table->enum('role', ['dono', 'editor', 'visualizador'])->default('dono');
           $table->timestamps();

           $table->unique(['account_id', 'user_id']);
        });
    }
};
