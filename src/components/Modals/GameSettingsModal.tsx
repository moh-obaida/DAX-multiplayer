import Modal from "../UI/Modal";
import type { GameSettings } from "../../types/game";

interface GameSettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: GameSettings["houseRules"];
  onUpdate?: (settings: Partial<GameSettings["houseRules"]>) => void;
  readOnly?: boolean;
}

export default function GameSettingsModal({ open, onClose, settings, onUpdate, readOnly }: GameSettingsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Game Rules">
      <div className="space-y-4 text-sm">
        <label className="flex items-center justify-between">
          <span className="text-ivory-muted">+2 stacking</span>
          <input
            type="checkbox"
            checked={settings.plus2Stack}
            disabled={readOnly}
            onChange={(e) => onUpdate?.({ plus2Stack: e.target.checked })}
            className="accent-gold w-5 h-5"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-ivory-muted">+4 stacking</span>
          <input
            type="checkbox"
            checked={settings.plus4Stack}
            disabled={readOnly}
            onChange={(e) => onUpdate?.({ plus4Stack: e.target.checked })}
            className="accent-gold w-5 h-5"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-ivory-muted">AFK auto-kick (3 strikes)</span>
          <input
            type="checkbox"
            checked={settings.afkRule}
            disabled={readOnly}
            onChange={(e) => onUpdate?.({ afkRule: e.target.checked })}
            className="accent-gold w-5 h-5"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-ivory-muted">AI replacement (Phase 2)</span>
          <input
            type="checkbox"
            checked={settings.aiReplacement}
            disabled
            className="accent-gold w-5 h-5 opacity-50"
          />
        </label>
        <p className="text-xs text-ivory-dim pt-2 border-t border-gold/10">
          30s turn timer · Manual UNO call · 2-card penalty if caught
        </p>
      </div>
    </Modal>
  );
}
