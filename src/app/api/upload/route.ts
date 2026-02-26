import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const authHeader = req.headers.get('authorization');

        if (authHeader !== 'Bearer mibinAdmin2026') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // We overwrite the explicit path where we fetch the profile initially
        const filePath = path.join(process.cwd(), 'public/img/PROFILE.jpeg');

        // Write directly to public dir
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ success: true, message: 'Image uploaded successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
