'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="relative z-10 border-b-4 border-cyan-500 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-pink-500 to-yellow-400 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                🎮
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
                ForceFi MARKETS
              </h1>
              <p className="text-xs text-cyan-400 font-mono tracking-wider">
                /// PREDICT THE FUTURE ///
              </p>
            </div>
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}


