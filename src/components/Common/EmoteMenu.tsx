import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { EMOTES, PHRASES } from "../../lib/constants";
import type { GameMessage } from "../../types/game";

interface EmoteMenuProps {
  playerId: string;
  playerName: string;
  onSend: (message: GameMessage) => void;
  disabled?: boolean;
}

export default function EmoteMenu({ playerId, playerName, onSend, disabled }: EmoteMenuProps) {
  const [open, setOpen] = useState(false);

  const send = (type: "emote" | "phrase", content: string) => {
    onSend({
      id: `msg-${Date.now()}`,
      playerId,
      playerName,
      type,
      content,
      timestamp: Date.now(),
    });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-32 z-40 w-12 h-12 rounded-full bg-gold text-emerald shadow-gold flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
        aria-label="Open emote menu"
      >
        <MessageCircle size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Emote menu">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label="Close" />
          <div className="relative w-72 max-w-[90vw] h-full bg-board border-l border-gold/20 shadow-panel animate-[slideIn_0.2s_ease-out] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gold/20">
              <h3 className="font-display text-gold font-semibold">Emotes & Phrases</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} className="text-ivory" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-ivory-dim mb-2">Emojis</p>
                <div className="grid grid-cols-4 gap-2">
                  {EMOTES.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      className="text-2xl p-2 rounded-lg hover:bg-gold/10 transition-colors"
                      aria-label={e.label}
                      onClick={() => send("emote", e.emoji)}
                    >
                      {e.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-ivory-dim mb-2">Phrases</p>
                <div className="space-y-2">
                  {PHRASES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-lg border border-gold/15 text-sm text-ivory hover:bg-gold/10 transition-colors"
                      onClick={() => send("phrase", p.text)}
                    >
                      {p.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
