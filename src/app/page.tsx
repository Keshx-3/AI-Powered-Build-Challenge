import { fetchCryptoData } from '@/lib/data';
import CryptoClientPage from './crypto-client-page';

export default async function Home() {
  const initialData = await fetchCryptoData();
  return <CryptoClientPage initialData={initialData} />;
}
