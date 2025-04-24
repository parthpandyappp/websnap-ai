export const Loader = ({ message }: { message: string }) => (
  <div className="flex flex-col justify-center items-center w-full h-full">
    <iframe
      src="https://lottie.host/embed/7a59336f-b9ae-4ba5-b330-0575bf49fd00/eUU3bDkmFL.lottie"
      title="Loading animation"
    />
    <p className="text-center text-sm text-white font-semibold">{message}</p>
  </div>
);
