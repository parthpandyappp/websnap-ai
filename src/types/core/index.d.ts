import { Article } from "@extractus/article-extractor";

export interface ArticleState {
  data: Article | null;
  loading: boolean;
  error: string | null;
}

export interface SummaryState {
  content: string;
  loading: boolean;
  error: string | null;
}
