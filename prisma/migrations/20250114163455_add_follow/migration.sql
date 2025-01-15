-- CreateTable
CREATE TABLE "_UserFollowRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFollowRelation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserFollowRelation_B_index" ON "_UserFollowRelation"("B");

-- AddForeignKey
ALTER TABLE "_UserFollowRelation" ADD CONSTRAINT "_UserFollowRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowRelation" ADD CONSTRAINT "_UserFollowRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
