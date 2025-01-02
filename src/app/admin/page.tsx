"use client";
import { FormEvent, useState } from "react";

export default function Admin() {
  const [res, setRes] = useState<{
    status: number;
    data: { message: Record<string, string[]> };
  }>();

  const [formData, setFormData] = useState<Record<string, string | number>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Submitting JSON Data:", formData);

    try {
      const response = await fetch("http://localhost:8000/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setRes({ status: response.status, data });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = event.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  }

  return (
    <div>
      <main className="flex flex-col gap-8 py-8 items-center">
        <form className="flex space-y-2 flex-col" onSubmit={onSubmit}>
          <div className="flex">
            <label htmlFor="id">Id: </label>
            <input
              type="text"
              name="id"
              onChange={handleChange}
              className="text-black"
            />
          </div>
          <div className="flex">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="text-black"
            />
          </div>
          <div className="flex">
            <label htmlFor="type">Type: </label>
            <input
              type="text"
              name="type"
              onChange={handleChange}
              className="text-black"
            />
          </div>
          <div className="flex">
            <label htmlFor="category">Category: </label>
            <input
              type="text"
              name="category"
              onChange={handleChange}
              className="text-black"
            />
          </div>
          <div className="flex">
            <label htmlFor="cost">Cost: </label>
            <input
              type="number"
              name="cost"
              onChange={handleChange}
              className="text-black"
            />
          </div>
          <button className="bg-white text-black rounded-sm px-4" type="submit">
            Submit
          </button>
        </form>
        <div>
          {res && res.status !== 200 && (
            <ul className="space-y-1">
              {Object.entries(res.data.message).map(([key, value]) => (
                <li className="flex" key={key}>
                  <p className="bg-red-800 rounded-md px-4">! {value}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
