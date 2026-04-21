export interface GroundSource {
  id: string;
  name: string;
  circleIcon: string;
  domain: string[];
  bias: string;
  readableBias: string;
}

export interface GroundStory {
  id: string;
  left: number;
  center: number;
  right: number;
  biasSourceCount: number;
  slug: string;
  sourceCount: number;
}

export interface GroundTopSource {
  id: string;
  name: string;
  circleIcon: string;
  slug: string;
}

export interface GroundLookupResponse {
  source: GroundSource;
  story: GroundStory;
  topSources: GroundTopSource[];
}

