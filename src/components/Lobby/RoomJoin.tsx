import Button from "../UI/Button";
import CardPanel from "../UI/CardPanel";

interface RoomJoinProps {
  code: string;
  onCodeChange: (code: string) => void;
  onJoin: () => void;
  loading?: boolean;
}

export default function RoomJoin({ code, onCodeChange, onJoin, loading }: RoomJoinProps) {
  return (
    <CardPanel title="Join by Code">
      <p className="text-sm text-ivory-muted mb-4">Enter the 6-digit code from your host.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="dax-input font-display text-2xl tracking-[0.4em] text-center sm:max-w-[220px]"
          maxLength={6}
          placeholder="000000"
          value={code}
          inputMode="numeric"
          aria-label="Room code"
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ""))}
        />
        <Button variant="neon" onClick={onJoin} disabled={loading || code.length !== 6}>
          {loading ? "Joining…" : "Join Room"}
        </Button>
      </div>
    </CardPanel>
  );
}
