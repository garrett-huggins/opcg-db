"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";

interface CardResponse {
  cards: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function CardSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });

  // Filter states
  const [nameFilter, setNameFilter] = useState(searchParams.get("name") || "");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || ""
  );
  const [colorFilter, setColorFilter] = useState(
    searchParams.get("color") || ""
  );
  const [setFilter, setSetFilter] = useState(searchParams.get("set") || "");

  const fetchCards = async (params: URLSearchParams) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/cards/search?${params.toString()}`
      );
      const data: CardResponse = await response.json();
      setCards(data.cards);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchParams = debounce((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/cards?${params.toString()}`);
    fetchCards(params);
  }, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    fetchCards(params);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Card Search</h1>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Name Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Card Name</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => {
              setNameFilter(e.target.value);
              updateSearchParams({ name: e.target.value });
            }}
            className="w-full p-2 border rounded"
            placeholder="Search by name..."
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              updateSearchParams({ category: e.target.value });
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="leader">Leader</option>
            <option value="character">Character</option>
            <option value="event">Event</option>
            <option value="stage">Stage</option>
          </select>
        </div>

        {/* Color Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Color</label>
          <select
            value={colorFilter}
            onChange={(e) => {
              setColorFilter(e.target.value);
              updateSearchParams({ color: e.target.value });
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">All Colors</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="purple">Purple</option>
            <option value="black">Black</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Type</label>
          <input
            type="text"
            value={typeFilter.join(",")}
            onChange={(e) => {
              setTypeFilter(e.target.value.split(","));
              updateSearchParams({ type: e.target.value });
            }}
            className="w-full p-2 border rounded"
            placeholder="Filter by type..."
          />
        </div>

        {/* Set Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Set</label>
          <input
            type="text"
            value={setFilter}
            onChange={(e) => {
              setSetFilter(e.target.value);
              updateSearchParams({ set: e.target.value });
            }}
            className="w-full p-2 border rounded"
            placeholder="Filter by set..."
          />
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {cards.length} of {pagination.total} cards
            </p>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{card.name}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {Array.isArray(card.type)
                      ? card.type.join(", ")
                      : card.type}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {card.category}
                  </p>
                  <p>
                    <span className="font-medium">Color:</span> {card.color}
                  </p>
                  <p>
                    <span className="font-medium">Set:</span> {card.set}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() =>
                      updateSearchParams({ page: page.toString() })
                    }
                    className={`px-4 py-2 rounded ${
                      pagination.page === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
