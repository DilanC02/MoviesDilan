export interface Movie {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  id: number;
}

export interface MovieResponse {
  results: Movie[];
}
