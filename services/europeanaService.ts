
import { Museum } from "../types";

const EUROPEANA_API_KEY = "api2demo";
const BASE_URL = "https://api.europeana.eu/record/v2/search.json";

export class EuropeanaService {
  /**
   * Zoekt naar een museum op naam (en optioneel stad) om afbeeldingen en metadata op te halen.
   */
  async getMuseumByName(name: string, city?: string): Promise<Museum | null> {
    const query = city ? `"${name}" AND "${city}"` : `"${name}"`;
    const params = new URLSearchParams({
      wskey: EUROPEANA_API_KEY,
      query: query,
      profile: "standard",
      rows: "1",
    });

    try {
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        if (city) return this.getMuseumByName(name);
        return null;
      }

      const item = data.items[0];
      const website = item.guid && item.guid.startsWith('http') ? item.guid : null;

      if (!website) return null; // Alleen musea met werkende website tonen

      return {
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: name,
        city: item.edmPlaceLabel?.[0]?.def || item.country?.[0] || city || "Onbekend",
        country: item.country?.[0] || "Europa",
        description: `Collectie gevonden via Europeana. Bevat onder andere: ${item.title?.[0] || 'diverse unieke objecten'}.`,
        imageUrl: item.edmPreview?.[0] || `https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=800`,
        website: website,
        highlightArtworks: item.title || [],
        lat: item.pl_wgs84_pos_lat?.[0] ? parseFloat(item.pl_wgs84_pos_lat[0]) : undefined,
        lng: item.pl_wgs84_pos_long?.[0] ? parseFloat(item.pl_wgs84_pos_long[0]) : undefined,
      };
    } catch (error) {
      console.error("Europeana Search Error:", error);
      return null;
    }
  }

  /**
   * Algemene zoekopdracht voor musea
   */
  async searchMuseums(query: string): Promise<Museum[]> {
    const params = new URLSearchParams({
      wskey: EUROPEANA_API_KEY,
      query: `what:museum AND (${query})`,
      profile: "standard",
      rows: "12",
    });

    try {
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = await response.json();
      if (!data.items) return [];

      return data.items
        .filter((item: any) => item.guid && item.guid.startsWith('http')) // Alleen werkende links
        .map((item: any) => ({
          id: item.id,
          name: item.dataProvider?.[0] || item.title?.[0] || "Museum",
          city: item.edmPlaceLabel?.[0]?.def || "Onbekend",
          country: item.country?.[0] || "Onbekend",
          description: `Onderdeel van de Europeana collectie.`,
          imageUrl: item.edmPreview?.[0] || `https://images.unsplash.com/photo-1544274431-7e8c33979667?auto=format&fit=crop&q=80&w=800`,
          website: item.guid,
          highlightArtworks: [item.title?.[0]],
          lat: item.pl_wgs84_pos_lat?.[0] ? parseFloat(item.pl_wgs84_pos_lat[0]) : undefined,
          lng: item.pl_wgs84_pos_long?.[0] ? parseFloat(item.pl_wgs84_pos_long[0]) : undefined,
        }));
    } catch (e) {
      return [];
    }
  }
}

export const europeana = new EuropeanaService();
