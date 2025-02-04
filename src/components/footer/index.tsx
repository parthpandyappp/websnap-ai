import { FaStar, FaGithubAlt } from "react-icons/fa";

export const Footer = () => (
  <footer className="py-2 px-2 flex justify-between gap-2 absolute bottom-0 bg-slate-600 w-full text-white">
    <p className="text-xs font-semibold">
      WebSnap AI, built by{" "}
      <a
        href="https://linkedin.com/in/parthpandyappp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-200 hover:text-teal-300 transition-colors"
      >
        @parthpandyappp
      </a>
    </p>
    <p className="text-xs font-bold flex items-center gap-1">
      <FaStar className="text-orange-400" />
      <a
        href="https://github.com/parthpandyappp/websnap-ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-gray-300 transition-colors"
      >
        Star it on <FaGithubAlt size={16} />
      </a>
    </p>
  </footer>
);
