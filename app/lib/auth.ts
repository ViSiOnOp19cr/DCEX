import GoogleProvider from "next-auth/providers/google";
import { db } from "./prisma";
import { Keypair } from "@solana/web3.js";

import { Session } from 'next-auth';

export interface session extends Session {
    user: {
      email: string;
      name: string;
      image: string
      uid: string;
    };
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET || 'secr3t',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? ""
        })
    ],
    callbacks: {
        session: ({ session, token }: any): session => {
            const newSession: session = session as session;
            if (newSession.user && token.uid) {
              newSession.user.uid = token.uid ?? "";
            }
            return newSession!;
        },
        async jwt({ token, account, profile }: any) {
            const user = await db.user.findFirst({
                where: {
                    email: token.email ?? ""
                }
            })
            if (user) {
              token.uid = user.id
            }
            return token
        },
        async signIn({ user, account, profile, email, credentials }: any) {
            if (account?.provider === "google") {
                const email = user.email;
                if (!email) {
                    return false
                }

                const userDb = await db.user.findFirst({
                    where: {
                        email: email
                    }
                })

                if (userDb) {
                    return true;
                }

                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                const privateKey = keypair.secretKey;

                await db.user.create({
                    data: {
                        email: email,
                        name: profile?.name,
                        
                        profilePicture: profile?.picture,
                        provider: "Google",
                        solwallet: {
                            create: {
                                publicKey: publicKey,
                                privateKey: privateKey.toString()
                            }
                        },
                        inrwallet: {
                            create: {
                                balance: 0
                            }
                        }
                    }
                })

                return true;
            }
            return false
        },
    }
}