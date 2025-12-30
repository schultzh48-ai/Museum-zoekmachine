
export interface Museum {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  imageUrl: string;
  website: string;
  highlightArtworks: string[];
  lat?: number;
  lng?: number;
  distance?: number;
  type?: string;
  imageSearchTerm?: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface AIRecommendation {
  museumName: string;
  reason: string;
  location: string;
  whyItMatches: string;
}

export interface Activity {
  name: string;
  type: string;
  description: string;
  distance?: string;
}
