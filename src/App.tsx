import useTabUrl from "./hooks/useTabUrl";

function App() {
  const url = useTabUrl();

  return (
    <div className="bg-slate-800 text-white h-screen w-screen p-2">
      <span>Hello</span>
      <span id="url">{url}</span>
    </div>
  );
}

export default App;
