export function AnimatedBlobs() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 blur-2xl md:blur-3xl opacity-15 md:opacity-20">
        <div className="absolute top-1/4 left-1/3 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-purple-400 rounded-full mix-blend-multiply animate-blob" />
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[230px] h-[230px] md:w-[450px] md:h-[450px] bg-orange-400 rounded-full mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[240px] h-[240px] md:w-[480px] md:h-[480px] bg-pink-400 rounded-full mix-blend-multiply animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
