import { headers } from 'next/headers';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
    productImage: f({
        image: { maxFileSize: '4MB', maxFileCount: 8 },
    })
        .middleware(async () => {
            const session = await auth.api.getSession({ headers: await headers() });
            if (!session) throw new UploadThingError('Unauthorized');
            if (session.user.role !== 'admin') throw new UploadThingError('Admin only');
            return { userId: session.user.id };
        })
        .onUploadComplete(({ file, metadata }) => {
            return { url: file.ufsUrl, key: file.key, uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
