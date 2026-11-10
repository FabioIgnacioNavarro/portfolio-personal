import { loadPortfolioContent } from '@/lib/content';
import { PortfolioContainer } from '@/components/PortfolioContainer';

export default function HomePage() {
  const content = loadPortfolioContent();

  return <PortfolioContainer content={content} />;
}
