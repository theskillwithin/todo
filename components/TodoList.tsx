"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useRef, useState } from "react";

export default function TodoList() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editing, setEditing] = useState<string>("");

  const editingInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const todos = localStorage.getItem("todos");
    if (todos) {
      setList(JSON.parse(todos));
    }
  }, []);

  const [newInput, setNewInput] = useState<string>("");

  const setItem = (item: string) => {
    setList((l) => [...l, item]);
    localStorage.setItem("todos", JSON.stringify([...list, item]));
  };

  const deleteItem = (index: number) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
    localStorage.setItem("todos", JSON.stringify(newList));
  };

  const clearAll = () => {
    setList([]);
    localStorage.removeItem("todos");
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setLoading(true);
    setItem(newInput);
    setNewInput("");
  };

  const moveItemUp = (index: number) => {
    if (index === 0) return;
    const item = list[index];
    const filteredItem = list.filter((_, i) => i !== index);
    const newList = [
      ...filteredItem.slice(0, index - 1),
      item,
      ...filteredItem.slice(index - 1),
    ];
    setList(newList);
    localStorage.setItem("todos", JSON.stringify(newList));
  };

  const movieItemDown = (index: number) => {
    if (index === list.length - 1) return;
    const item = list[index];
    const filteredItem = list.filter((_, i) => i !== index);
    const newList = [
      ...filteredItem.slice(0, index + 1),
      item,
      ...filteredItem.slice(index + 1),
    ];
    setList(newList);
    localStorage.setItem("todos", JSON.stringify(newList));
  };

  const setEditingItem = (index: number) => {
    const newList = list.map((item, i) => (i === index ? editing : item));
    setList(newList);

    setEditingIndex(null);
    setEditing("");
  };

  const handleSetEditing = (index: number, initValue: string) => {
    setEditingIndex(index);
    setEditing(initValue);
    setTimeout(() => {
      editingInput.current?.focus();
    }, 0);
  };

  return (
    <div className="container m-6">
      <form onSubmit={handleOnSubmit}>
        <fieldset disabled={loading} aria-busy={loading}>
          <input
            type="text"
            placeholder="Add todo"
            onChange={(e) => setNewInput(e.target.value)}
            value={newInput}
            className="text-black h-10 p-4"
          />
          <button type="submit" className="ml-4 border-white border px-2 h-10">
            submit
          </button>
          <button
            type="button"
            className="ml-4 border-white border px-2 h-10"
            onClick={clearAll}
          >
            clear all items
          </button>
        </fieldset>
      </form>
      <ul className="list-disc my-4 text-2xl flex flex-col gap-4 max-w-[400px]">
        {list.map((item, i) => (
          <li
            key={i}
            className="flex group items-center bg-gray-500 rounded px-4 justify-between h-10"
          >
            {editingIndex === i ? (
              <form onSubmit={() => setEditingItem(i)} className="max-w-[70%]">
                <input
                  type="text"
                  className="text-black w-full"
                  value={editing}
                  onChange={(e) => setEditing(e.target.value)}
                  ref={editingInput}
                />
              </form>
            ) : (
              <button type="button" onClick={() => handleSetEditing(i, item)}>
                {item}
              </button>
            )}
            <div className="group-hover:opacity-100 opacity-0 ml-4 transition-opacity duration-300">
              <button
                aria-label="delete"
                type="button"
                className="font-bold text-red-500 hover:text-red-700"
                onClick={() => deleteItem(i)}
              >
                &times;
              </button>
              {i > 0 && (
                <button
                  aria-label="move item up"
                  type="button"
                  className="hover:opacity-75"
                  onClick={() => moveItemUp(i)}
                >
                  ☝️
                </button>
              )}
              {i < list.length - 1 && (
                <button
                  aria-label="move item down"
                  type="button"
                  className="hover:opacity-75"
                  onClick={() => movieItemDown(i)}
                >
                  👇
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
