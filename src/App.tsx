import { ReactTyped } from "react-typed";
import useTabUrl from "./hooks/useTabUrl";
import { useEffect, useState } from "react";
import { extract } from "@extractus/article-extractor";
import { getSummary } from "./services/summary-services";
import { ArticleState, SummaryState } from "./types/core";
import { Loader, NoSummary, Header, Footer } from "./components";

function App() {
  const url = useTabUrl();

  const [articleState, setArticleState] = useState<ArticleState>({
    data: null,
    loading: false,
    error: null,
  });

  const [summaryState, setSummaryState] = useState<SummaryState>({
    content: "",
    loading: false,
    error: null,
  });

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(summaryState.content);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const fetchArticleAndSummary = async (articleUrl: string | null) => {
    if (!articleUrl) {
      setArticleState((prev) => ({ ...prev, error: "No URL provided" }));
      return;
    }

    setArticleState((prev) => ({ ...prev, loading: true, error: null }));
    setSummaryState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const article = await extract(articleUrl);
      if (!article) {
        throw new Error("No article found");
      }

      setArticleState({ data: article, loading: false, error: null });

      try {
        const aiSummary = await getSummary(article.content);
        setSummaryState({
          content: aiSummary,
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        setSummaryState((prev) => ({
          ...prev,
          loading: false,
          error: `Failed to generate summary: ${error}`,
        }));
      }
    } catch (error: unknown) {
      setArticleState((prev) => ({
        ...prev,
        loading: false,
        error: `Failed to fetch article: ${error}`,
      }));
    }
  };

  useEffect(() => {
    setSummaryState((prev) => ({ ...prev, content: "", error: null }));
    setArticleState((prev) => ({ ...prev, data: null, error: null }));
    fetchArticleAndSummary(url);
  }, [url]);

  const renderContent = () => {
    if (!articleState.data) {
      return <NoSummary />;
    }

    if (articleState.loading || summaryState.loading) {
      return <Loader message="Wait for a sec, WebSnap AI at work..." />;
    }

    if (articleState.error) {
      return <div className="text-red-500">{articleState.error}</div>;
    }

    if (summaryState.error) {
      return <div className="text-red-500">{summaryState.error}</div>;
    }

    if (summaryState.content) {
      return (
        <div className="flex flex-col gap-4 p-4 pt-3 mb-6">
          <div className="flex flex-col w-full h-full gap-4">
            <Header
              copyToClipboardFn={copyText}
              source={articleState.data.source}
              favicon={articleState.data.favicon}
              showCopyToClipboard={Boolean(summaryState.content.length)}
            />
            {articleState.data.image && (
              <img
                src={articleState.data.image}
                alt={articleState.data.title || "Article header"}
                className="w-full object-cover"
              />
            )}
            <h1 className="text-xl font-bold w-full">
              {articleState.data.title}
            </h1>
            <ReactTyped
              className="text-sm text-justify"
              strings={[summaryState.content]}
              typeSpeed={20}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-slate-800 text-white h-screen w-screen overflow-auto">
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
