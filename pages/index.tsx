import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cookTime, setCookTime] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        ingredients: ingredients,
        cookTime: cookTime as number,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    setRecipes([...data.recipes, ...recipes]);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Chef AI</title>
        <meta name="description" content="Create recipes with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="min-h-screen p-10 bg-gray-100 text-black">
        <div className="text-7xl">🧑‍🍳</div>
        <h1 className="text-5xl p-2 font-bold">ChefAI</h1>
        <h2 className="text-xl p-2 font-normal">
          Generate recipes with AI based on ingredients and cook time
        </h2>
        <form onSubmit={handleSubmit}>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="">
              <label htmlFor="ingredient">
                <input
                  type="text"
                  value={ingredient}
                  onChange={e => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = e.target.value;
                    setIngredients(newIngredients);
                  }}
                  className="p-2 m-2 border-2 border-gray-300 rounded-md"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const newIngredients = [...ingredients];
                  newIngredients.splice(index, 1);
                  setIngredients(newIngredients);
                }}
                className="p-2 m-2 bg-red-700 text-white rounded-xl hover:bg-red-900"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="">
            <button
              type="button"
              onClick={() => setIngredients([...ingredients, ""])}
              className="p-2 m-2 bg-neutral-300 rounded-xl hover:bg-neutral-500"
            >
              Add Ingredient
            </button>
          </div>
          <div className="flex flex-row items-center">
            <label htmlFor="cookTime" className="text-base p-2 font-bold block">
              Cook time
            </label>
            <input
              type="number"
              value={cookTime || ""}
              placeholder="20"
              onChange={e => setCookTime(Number(e.target.value))}
              className="p-2 m-2 border-2 border-gray-300 rounded-md w-24"
            />
            <span className="text-base p-2 font-bold">minutes</span>
          </div>
          <div className="">
            <button
              type="submit"
              className={
                "bg-green-700 text-white p-2 m-2 rounded-xl hover:bg-green-900" +
                (ingredients.length === 0 && cookTime === null
                  ? " opacity-50 cursor-not-allowed"
                  : "")
              }
              disabled={
                (ingredients.length === 0 && cookTime === null) || loading
              }
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes &&
            recipes.map((recipe, index) => (
              <div key={index} className="p-2 m-2 bg-neutral-300 rounded-md">
                <h3 className="text-2xl p-2 font-bold">Recipe {index + 1}</h3>
                <p className="p-2 m-2 text-black">{recipe}</p>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
