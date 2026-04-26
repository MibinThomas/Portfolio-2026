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

        // Git-Backed Image upload block
        if (process.env.GITHUB_TOKEN) {
            const REPO = "MibinThomas/Portfolio-2026";
            const TOKEN = process.env.GITHUB_TOKEN;
            const FILE_PATH = "public/img/PROFILE.jpeg";

            // Retrieve existing SHA if the file exists
            let sha;
            const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
                cache: 'no-store'
            });

            if (getRes.ok) {
                const getJson = await getRes.json();
                sha = getJson.sha;
            }

            const contentBase64 = buffer.toString('base64');

            const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
                body: JSON.stringify({
                    message: "CMS Update: Profile Image Replacement",
                    content: contentBase64,
                    sha: sha,
                    branch: "main"
                })
            });

            if (!putRes.ok) throw new Error("Failed to commit image to GitHub");

            return NextResponse.json({ success: true, message: 'Image replaced on GitHub! Vercel is compiling.' });
        } else {
            const filePath = path.join(process.cwd(), 'public/img/PROFILE.jpeg');
            await fs.writeFile(filePath, buffer);
            return NextResponse.json({ success: true, message: 'Image uploaded locally' });
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
    }
}
