import { getHomepageData } from "@/lib/api-client";
import { HomePageClient } from "@/components/home";

// Force dynamic rendering - data will be cached at fetch level via ISR
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { komikLatest, komikPopular, animeLatest, animeRecommended } = await getHomepageData();

  return (
    <HomePageClient
      komikLatest={komikLatest}
      komikPopular={komikPopular}
      animeLatest={animeLatest}
      animeRecommended={animeRecommended}
    />
  );
}
