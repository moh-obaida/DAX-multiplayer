import { useToastStore } from "../../store/toastStore";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg border shadow-panel text-sm font-medium animate-[slideIn_0.2s_ease]
            ${t.type === "error" ? "bg-red/20 border-red text-ivory" : t.type === "success" ? "bg-green/20 border-green text-ivory" : "bg-board border-gold/40 text-ivory"}`}
          onClick={() => remove(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
