import { Movie } from "@/types/movie";

// API configuration
const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace this with your actual TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const posterSizes = {
  small: `${IMAGE_BASE_URL}/w185`,
  medium: `${IMAGE_BASE_URL}/w300`,
  large: `${IMAGE_BASE_URL}/w500`,
  original: `${IMAGE_BASE_URL}/original`,
};

export const backdropSizes = {
  small: `${IMAGE_BASE_URL}/w300`,
  medium: `${IMAGE_BASE_URL}/w780`,
  large: `${IMAGE_BASE_URL}/w1280`,
  original: `${IMAGE_BASE_URL}/original`,
};

// API requests
export const fetchTrending = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const fetchPopular = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const fetchTopRated = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const fetchUpcoming = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return [];
  }
};

export const fetchTVPopular = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results.map((item: any) => ({
      ...item,
      title: item.name,
      release_date: item.first_air_date,
    }));
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
};

export const fetchMovieDetails = async (id: string): Promise<Movie | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
    );
    return await response.json();
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    return null;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const fetchGenres = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};
