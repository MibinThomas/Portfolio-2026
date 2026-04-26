import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const JSON_PATH = path.join(process.cwd(), 'src/data/portfolio.json');

export async function GET() {
    try {
        const dataString = await fs.readFile(JSON_PATH, 'utf8');
        const portfolioData = JSON.parse(dataString);
        return NextResponse.json(portfolioData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read CMS data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Basic password protection since this is a local CMS
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer mibinAdmin2026') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const newData = await req.json();

        // Validate json strictly
        if (!newData || !newData.hero || !newData.about) {
            return NextResponse.json({ error: 'Invalid Root Data' }, { status: 400 });
        }

        // Git-Backed CMS integration for Vercel Serverless environment
        if (process.env.GITHUB_TOKEN) {
            const REPO = "MibinThomas/Portfolio-2026";
            const TOKEN = process.env.GITHUB_TOKEN;
            const FILE_PATH = "src/data/portfolio.json";

            // 1. Get current file's SHA from GitHub
            const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
                cache: 'no-store'
            });

            if (!getRes.ok) throw new Error("Failed to fetch file from GitHub: Ensure your GITHUB_TOKEN has 'repo' scope.");
            const getJson = await getRes.json();
            const sha = getJson.sha;

            // 2. Commit new data to GitHub
            const contentBase64 = Buffer.from(JSON.stringify(newData, null, 2)).toString('base64');

            const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
                body: JSON.stringify({
                    message: "CMS Update: Portfolio Content",
                    content: contentBase64,
                    sha: sha,
                    branch: "main"
                })
            });

            if (!putRes.ok) throw new Error("Failed to commit JSON to GitHub repository.");

            return NextResponse.json({ success: true, message: 'Saved via GitHub! Vercel is building the update.' });
        } else {
            // Local write system (when running npm run dev)
            await fs.writeFile(JSON_PATH, JSON.stringify(newData, null, 2), 'utf8');
            return NextResponse.json({ success: true, message: 'Portfolio updated locally' });
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Failed to write CMS data' }, { status: 500 });
    }
}
