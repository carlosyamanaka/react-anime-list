-- CreateTable
CREATE TABLE "user_animes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "mal_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "title_japanese" TEXT,
    "image_url" TEXT,
    "score" DECIMAL(65,30),
    "rank" INTEGER,
    "popularity" INTEGER,
    "type" TEXT,
    "episodes" INTEGER,
    "year" INTEGER,
    "rating" TEXT,
    "synopsis" TEXT,
    "url" TEXT,
    "studios" JSONB,
    "genres" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_animes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_animes_user_id_mal_id_key" ON "user_animes"("user_id", "mal_id");

-- AddForeignKey
ALTER TABLE "user_animes" ADD CONSTRAINT "user_animes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
