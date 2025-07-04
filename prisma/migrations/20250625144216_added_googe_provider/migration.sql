-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "provider" "Provider" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolWallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SolWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InrWallet" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InrWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolWallet_userId_key" ON "SolWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InrWallet_userId_key" ON "InrWallet"("userId");

-- AddForeignKey
ALTER TABLE "SolWallet" ADD CONSTRAINT "SolWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InrWallet" ADD CONSTRAINT "InrWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
