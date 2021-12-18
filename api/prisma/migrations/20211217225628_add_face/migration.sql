-- CreateTable
CREATE TABLE "faces" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "encodings" DOUBLE PRECISION[],

    CONSTRAINT "faces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "faces_slug_key" ON "faces"("slug");
