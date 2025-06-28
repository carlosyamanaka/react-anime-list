-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "user_anime_id" INTEGER NOT NULL,
    "feedback_text" TEXT,
    "score" DECIMAL(3,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_anime_id_fkey" FOREIGN KEY ("user_anime_id") REFERENCES "user_animes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
