export const Header = ({
  favicon,
  source,
}: {
  favicon?: string;
  source?: string;
}) => (
  <div className="flex items-center gap-2">
    {favicon && <img src={favicon} alt="Website favicon" className="h-6 w-6" />}
    <p className="text-sm font-semibold">source: {source}</p>
  </div>
);
