import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { get, set } from "idb-keyval";
import { initialState } from "./data";
const Context = import.meta.hot?.data.context || createContext(null);
if (import.meta.hot) import.meta.hot.data.context = Context;
export const useApp = () => useContext(Context);
export function Provider({ children }) {
  const [state, setState] = useState(initialState),
    [loaded, setLoaded] = useState(false),
    [toast, setToast] = useState(null);
  const timer = useRef();
  useEffect(() => {
    get("adcraft-state-v1")
      .then((saved) => {
        if (saved?.version === 1) setState(saved);
      })
      .catch(() =>
        setToast({
          message:
            "Browser storage is unavailable. Changes will last for this session.",
          kind: "error",
        }),
      )
      .finally(() => setLoaded(true));
    return () => clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(
      () =>
        set("adcraft-state-v1", state).catch(() =>
          notify(
            "Could not save to this browser. Export your work before closing.",
            "error",
          ),
        ),
      250,
    );
    return () => clearTimeout(t);
  }, [state, loaded]);
  function notify(message, kind = "success") {
    clearTimeout(timer.current);
    setToast({ message, kind });
    timer.current = setTimeout(() => setToast(null), 4500);
  }
  const update = (fn) =>
    setState((prev) =>
      typeof fn === "function" ? fn(prev) : { ...prev, ...fn },
    );
  const patchAsset = (id, patch) =>
    update((s) => ({
      ...s,
      assets: s.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  const addAssets = (assets) =>
    update((s) => ({ ...s, assets: [...assets, ...s.assets] }));
  return (
    <Context.Provider
      value={{ state, update, patchAsset, addAssets, notify, loaded }}
    >
      {children}
      {toast && (
        <div className={"toast " + toast.kind} role="status">
          <span>{toast.kind === "error" ? "!" : "✓"}</span>
          {toast.message}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
