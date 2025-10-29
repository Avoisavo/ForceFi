interface HeaderProps {
  coins: number;
}

export default function Header({ coins }: HeaderProps) {
  return (
    <header className="relative z-10 border-b-4 border-cyan-500 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 animate-pulse">
              🎮 HanSolo MARKETS 🎮
            </h1>
            <p className="text-sm text-cyan-400 mt-2 font-mono tracking-wider">
              /// PREDICT THE FUTURE - WIN COINS ///
            </p>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-lg border-4 border-yellow-300 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              <div className="text-xs text-yellow-900 font-bold">YOUR COINS</div>
              <div className="text-3xl font-bold text-yellow-50 font-mono">
                💰 {coins.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


