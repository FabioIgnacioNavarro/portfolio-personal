import { loadPortfolioContent } from '@/lib/content';
import { PortfolioContainer } from '@/components/PortfolioContainer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const content = loadPortfolioContent();

  return <PortfolioContainer content={content} />;
}
