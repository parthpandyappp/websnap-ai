export const Loader = ({ message }: { message: string }) => (
  <div className="flex flex-col justify-center items-center w-full h-full">
    <img
      src="/loading.gif"
      alt="Loading animation"
      className="w-200 h-200 mb-4"
    />
    <p className="text-center text-sm text-white font-semibold">{message}</p>
  </div>
);
