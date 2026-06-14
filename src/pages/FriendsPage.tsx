import { useState } from "react";
import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import PageShell from "../components/layout/PageShell";
import { useFriendsStore } from "../store/friendsStore";
import { useToastStore } from "../store/toastStore";

function StatusDot({ status }: { status: "online" | "away" | "offline" }) {
  const cls = status === "online" ? "dax-status-online" : status === "away" ? "dax-status-away" : "dax-status-offline";
  return <span className={cls} />;
}

export default function FriendsPage() {
  const { friends, incoming, outgoing, blocked, searchQuery, setSearchQuery, acceptRequest, rejectRequest, blockUser, unblockUser } = useFriendsStore();
  const addToast = useToastStore((s) => s.add);
  const [addUsername, setAddUsername] = useState("");

  return (
    <PageShell title="Friends" subtitle="Manage your network, requests, and blocked users." maxWidth="full">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CardPanel title="Add Friend">
            <div className="flex gap-3">
              <input className="dax-input flex-1" placeholder="Search by username…" value={addUsername || searchQuery}
                onChange={(e) => { setAddUsername(e.target.value); setSearchQuery(e.target.value); }} />
              <Button variant="neon" onClick={() => addToast(`Friend request sent to ${addUsername}`, "success")}>Add</Button>
            </div>
          </CardPanel>

          <CardPanel title={`Friends (${friends.length})`} highlight>
            <div className="space-y-2">
              {friends.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-dark/40 border border-gold/10 hover:border-gold/25 transition-colors">
                  <div className="flex items-center gap-3">
                    <StatusDot status={f.status} />
                    <span className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-sm font-bold text-gold">{f.username[0]}</span>
                    <div>
                      <p className="font-medium text-ivory">{f.username}</p>
                      <p className="text-xs text-ivory-dim capitalize">{f.status} · {f.mutualFriends} mutual</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => addToast(`Invite sent to ${f.username}`, "info")}>Invite</Button>
                    <Button variant="ghost" size="sm" onClick={() => blockUser(f.username)}>Block</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardPanel>
        </div>

        <div className="space-y-6">
          <CardPanel title="Incoming Requests">
            {incoming.length === 0 ? <p className="text-sm text-ivory-dim">No pending requests</p> : incoming.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gold/10 last:border-0">
                <span className="text-ivory">{r.username}</span>
                <div className="flex gap-1">
                  <Button variant="primary" size="sm" onClick={() => acceptRequest(r.id)}>Accept</Button>
                  <Button variant="ghost" size="sm" onClick={() => rejectRequest(r.id)}>Reject</Button>
                </div>
              </div>
            ))}
          </CardPanel>

          <CardPanel title="Outgoing Requests">
            {outgoing.map((r) => (
              <div key={r.id} className="flex justify-between py-2 text-sm text-ivory-muted">
                <span>{r.username}</span><span className="text-ivory-dim">Pending</span>
              </div>
            ))}
          </CardPanel>

          <CardPanel title="Blocked Users">
            {blocked.length === 0 ? <p className="text-sm text-ivory-dim">None</p> : blocked.map((b) => (
              <div key={b} className="flex justify-between py-2">
                <span>{b}</span>
                <button type="button" className="text-xs text-gold" onClick={() => unblockUser(b)}>Unblock</button>
              </div>
            ))}
          </CardPanel>
        </div>
      </div>
    </PageShell>
  );
}
