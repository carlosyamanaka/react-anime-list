-- CreateTable
CREATE TABLE "animes" (
    "id" SERIAL NOT NULL,
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

    CONSTRAINT "animes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER,
    "feedback_text" TEXT,
    "score" DECIMAL(3,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "animes_mal_id_key" ON "animes"("mal_id");

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "animes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
