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

        await fs.writeFile(JSON_PATH, JSON.stringify(newData, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Portfolio updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to write CMS data' }, { status: 500 });
    }
}
