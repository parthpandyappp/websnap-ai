declare module "@extractus/article-extractor" {
  export interface Article {
    url: string;
    title: string;
    description: string;
    image: string;
    author: string;
    favicon: string;
    content: string;
    published: string;
    type: string;
    source: string;
    links: string[];
    ttr: number;
  }
  export function extract(input: string): Article | null;
}
