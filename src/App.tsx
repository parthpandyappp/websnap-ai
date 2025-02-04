import useTabUrl from "./hooks/useTabUrl";
import { ReactTyped } from "react-typed";
import { useEffect, useState } from "react";
import { FaStar, FaGithubAlt } from "react-icons/fa";
import { getSummary } from "./services/summary-services";
import { Article, extract } from "@extractus/article-extractor";

function App() {
  const url = useTabUrl();
  const [article, setArticle] = useState<Article | null>();
  const [summary, setSummary] = useState<string | null>("");
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
    setSummary("");
    setArticle(null);
    getArticle(url);
  }, [url]);

  return (
    <div className="bg-slate-800 text-white h-screen w-screen overflow-auto">
      {summary?.length ? (
        <div className="flex flex-col gap-4 p-4 pt-3">
          <div className="flex flex-col w-full h-full gap-4">
            <div className="flex items-center gap-2">
              {article?.favicon && (
                <img src={article?.favicon} alt="favicon" className="h-6 w-6" />
              )}
              <p className="text-sm font-semibold">source: {article?.source}</p>
            </div>
            {article ? <img src={article?.image} alt="img" /> : null}

            <p className="text-xl font-bold w-full">{article?.title}</p>
            <ReactTyped
              className="text-sm text-justify"
              strings={[summary]}
              typeSpeed={20}
            />
          </div>
        </div>
      ) : !article ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <iframe src="https://lottie.host/embed/9deddf58-995d-451b-a1e8-4d90fbb10102/UpdmX8lWZl.lottie"></iframe>
          <p className="text-center text-sm text-white font-semibold">
            No Summary Available for this page
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <iframe src="https://lottie.host/embed/7a59336f-b9ae-4ba5-b330-0575bf49fd00/eUU3bDkmFL.lottie"></iframe>
          <p className="text-center text-sm text-white font-semibold">
            wait for a sec, WebSnap AI at work...
          </p>
        </div>
      )}
      <footer className="py-2 px-2 flex justify-between gap-2 absolute bottom-0 bg-slate-600 w-full text-white">
        <p className="text-xs font-semibold">
          WebSnap AI, built by{" "}
          <span className="text-teal-200">@parthpandyappp</span>
        </p>
        <p className="text-xs font-bold flex items-center gap-1">
          <FaStar color="orange" />
          <span className="flex items-center gap-1">
            Star it on <FaGithubAlt size={16} />
          </span>
        </p>
      </footer>
    </div>
  );
}

export default App;
