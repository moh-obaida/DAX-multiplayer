import { create } from "zustand";

export interface Friend {
  id: string;
  username: string;
  avatarId: string;
  status: "online" | "away" | "offline";
  mutualFriends: number;
}

export interface FriendRequest {
  id: string;
  username: string;
  avatarId: string;
  direction: "incoming" | "outgoing";
  sentAt: number;
}

interface FriendsStore {
  friends: Friend[];
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  blocked: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  blockUser: (username: string) => void;
  unblockUser: (username: string) => void;
}

const MOCK_FRIENDS: Friend[] = [
  { id: "f1", username: "NadiaK", avatarId: "avatar-2", status: "online", mutualFriends: 3 },
  { id: "f2", username: "OmarPlays", avatarId: "avatar-3", status: "online", mutualFriends: 1 },
  { id: "f3", username: "ZaraCards", avatarId: "avatar-4", status: "away", mutualFriends: 5 },
  { id: "f4", username: "KhalidDAX", avatarId: "avatar-5", status: "offline", mutualFriends: 2 },
];

export const useFriendsStore = create<FriendsStore>((set) => ({
  friends: MOCK_FRIENDS,
  incoming: [
    { id: "r1", username: "LaylaM", avatarId: "avatar-6", direction: "incoming", sentAt: Date.now() - 3600000 },
  ],
  outgoing: [
    { id: "r2", username: "YusufG", avatarId: "avatar-7", direction: "outgoing", sentAt: Date.now() - 86400000 },
  ],
  blocked: [],
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  acceptRequest: (id) => set((s) => {
    const req = s.incoming.find((r) => r.id === id);
    if (!req) return s;
    return {
      incoming: s.incoming.filter((r) => r.id !== id),
      friends: [...s.friends, { id: req.id, username: req.username, avatarId: req.avatarId, status: "online", mutualFriends: 0 }],
    };
  }),
  rejectRequest: (id) => set((s) => ({ incoming: s.incoming.filter((r) => r.id !== id) })),
  blockUser: (username) => set((s) => ({
    blocked: [...s.blocked, username],
    friends: s.friends.filter((f) => f.username !== username),
  })),
  unblockUser: (username) => set((s) => ({ blocked: s.blocked.filter((b) => b !== username) })),
}));
