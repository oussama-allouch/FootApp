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
        Schema::create('footmatchs', function (Blueprint $table) {
            $table->id();
            $table->string('equipe1');
            $table->string('equipe2');
            $table->dateTime('date_heure');
            $table->foreignId('stade_id')->constrained('stades')->onDelete('cascade');
            $table->enum('statut', ['à venir', 'en cours', 'terminé'])->default('à venir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footmatchs');
    }
};
