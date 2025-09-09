import { fetchCryptoData } from '@/lib/data';
import CryptoClientPage from './crypto-client-page';

export const dynamic = 'force-dynamic'; // Add this line here

export default async function Home() {
  const initialData = await fetchCryptoData();
  return <CryptoClientPage initialData={initialData} />;
}
