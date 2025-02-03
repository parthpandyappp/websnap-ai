import useTabUrl from "./hooks/useTabUrl";
import { useEffect, useState } from "react";
import { getSummary } from "./services/summary-services";
import { Article, extract } from "@extractus/article-extractor";

function App() {
  const url = useTabUrl();
  const [article, setArticle] = useState<Article | null>();
  const [summary, setSummary] = useState<string | null>("null");

  const getArticle = async (url: string | null) => {
    try {
      const article = await extract(url || "");
      if (article) {
        setArticle(article);
        const { content } = article;
        const aiSummary = await getSummary(content);
        setSummary(aiSummary);
      } else {
        console.log("No article found.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getArticle(url);
  }, [url]);

  return (
    <div className="flex flex-col gap-4 bg-slate-800 text-white h-screen w-screen p-2 overflow-auto">
      <p className="text-xl">Active URL: </p>
      {article ? <img src={article?.image} alt="img" /> : null}
      <span id="url">{url}</span>
      {/* <p className="text-sm">{JSON.stringify(article)}</p> */}
      <p className="text-sm">{summary}</p>
    </div>
  );
}

export default App;
