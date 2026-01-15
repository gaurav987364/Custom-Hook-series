import React, { useState, useCallback, useEffect, useMemo, FormEvent } from 'react';

type Sex = 'Male' | 'Female' | 'Other';

type Card = { id: number; name: string; age: number; sex: Sex };

type PlaceholderCard = Card & { placeholder: true };
type DisplayItem = Card | PlaceholderCard;

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
};

// Generic undoable hook
function useUndoable<T>(initialPresent: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: []
  });

  const set = useCallback((newPresent: T) => {
    setState(({ past, present }) => ({
      past: [...past, present],
      present: newPresent,
      future: []
    }));
  }, []);

  const undo = useCallback(() => {
    setState(({ past, present, future }) => {
      if (past.length === 0) return { past, present, future };
      const previous = past[past.length - 1];
      return {
        past: past.slice(0, -1),
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(({ past, present, future }) => {
      if (future.length === 0) return { past, present, future };
      const next = future[0];
      return {
        past: [...past, present],
        present: next,
        future: future.slice(1)
      };
    });
  }, []);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return {
    present: state.present,
    set,
    undo,
    redo,
    canUndo,
    canRedo
  };
};

// Test component
const UndoableCardManager: React.FC = () => {
  const {
    present: cards,
    set: setCards,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoable<Card[]>([]);

  const [form, setForm] = useState({ name: '', age: '', sex: 'Male' as Sex });
  const [lastAction, setLastAction] = useState<{
    type: 'delete';
    card: Card;
    index: number;
  } | null>(null);

  // Handle Ctrl+Z for undo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) {
          undo();
          setLastAction(null);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, canUndo]);

  // Compute items to render, including placeholder for deleted card
  const displayItems = useMemo<DisplayItem[]>(() => {
    const items: DisplayItem[] = [...cards];
    if (lastAction?.type === 'delete') {
      const { card, index } = lastAction;
      const placeholder: PlaceholderCard = { ...card, placeholder: true };
      items.splice(index, 0, placeholder);
    }
    return items;
  }, [cards, lastAction]);

  // Add new card
  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age) return;
    const newCard: Card = {
      id: Date.now(),
      name: form.name,
      age: parseInt(form.age, 10),
      sex: form.sex
    };
    setCards([...cards, newCard]);
    setLastAction(null);
    setForm({ name: '', age: '', sex: 'Male' });
  };

  // Delete card
  const handleDelete = (id: number) => {
    const idx = cards.findIndex(c => c.id === id);
    const card = cards[idx];
    const newList = cards.filter(c => c.id !== id);
    setCards(newList);
    setLastAction({ type: 'delete', card, index: idx });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Card Manager with Undo/Redo</h1>
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
          className="p-2 border rounded"
        />
        <select
          value={form.sex}
          onChange={e => setForm({ ...form, sex: e.target.value as Sex })}
          className="p-2 border rounded"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Card
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayItems.map((item, idx) =>
          'placeholder' in item && item.placeholder ? (
            <div
              key={`ph-${idx}`}
              className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center"
            >
              <p className="mb-2 text-gray-500">Card deleted</p>
              <div className="space-x-2">
                <button
                  onClick={() => { undo(); setLastAction(null); }}
                  disabled={!canUndo}
                  className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Undo
                </button>
                <button
                  onClick={() => redo()}
                  disabled={!canRedo}
                  className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                >
                  Redo
                </button>
              </div>
            </div>
          ) : (
            <div
              key={(item as Card).id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{(item as Card).name}</h2>
                <p>Age: {(item as Card).age}</p>
                <p>Sex: {(item as Card).sex}</p>
              </div>
              <button
                onClick={() => handleDelete((item as Card).id)}
                className="mt-4 self-end px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UndoableCardManager;
