import Button from "../UI/Button";
import CardPanel from "../UI/CardPanel";

interface RoomCreateProps {
  onCreate: () => void;
  loading?: boolean;
}

export default function RoomCreate({ onCreate, loading }: RoomCreateProps) {
  return (
    <CardPanel glow className="h-full">
      <p className="text-gold text-[10px] uppercase tracking-widest mb-2">Host</p>
      <h3 className="font-display text-xl font-bold text-ivory mb-2">Create Private Room</h3>
      <p className="text-sm text-ivory-muted mb-4">
        Get a 6-digit code, invite friends, and customize rules before starting.
      </p>
      <Button variant="secondary" onClick={onCreate} disabled={loading}>
        {loading ? "Creating…" : "Create Room"}
      </Button>
    </CardPanel>
  );
}
