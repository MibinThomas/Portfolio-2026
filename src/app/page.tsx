import { promises as fs } from 'fs';
import path from 'path';
import PortfolioClient from '@/components/PortfolioClient';

export default async function Page() {
  // Path to our simple JSON database
  const jsonPath = path.join(process.cwd(), 'src/data/portfolio.json');

  // Read the CMS data server-side
  const dataString = await fs.readFile(jsonPath, 'utf8');
  const portfolioData = JSON.parse(dataString);

  // Pass it to the interactive Apple Glass client
  return <PortfolioClient data={portfolioData} />;
}
