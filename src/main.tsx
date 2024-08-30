import "./global.scss";
import { FormEvent, useEffect, useState } from "react";

interface Item {
  "Item name": string,
  "Clasificacion": string,
  "Rarity": string,
  "Url": string
}

export function Main() {
  const [items, setItems] = useState<Item[]>([]);
  const [generatedItem, setGeneratedItem] = useState<Item | undefined>(undefined);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get the form data
    const formData = new FormData(e.currentTarget);
    const rarity = formData.get("rarity") as string;
    const classification = formData.get("classification") as string;

    // filter all items that match the selected rarity and classification
    const filteredItems = items.filter(item => {
      return (item["Rarity"] === rarity || item["Rarity"] === "Varia") && item["Clasificacion"] === classification;
    });

    // pick a random item from the filtered items
    const randomItem = filteredItems[Math.round(Math.random() * filteredItems.length)];


    setGeneratedItem(randomItem);
  }


  // fetch json data from public
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/data/db.json")

      const data = await response.json();

      setItems(data);
    };

    void loadData();
  }, []);

  return (
    <>
      <header className="text-center py-6 theme-bg">
        <h1 className="text-4xl font-bold text-white">D&D Item Generator</h1>
      </header>

      <main className="p-8">
        <section className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">Item Generator</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="rarity" className="block mb-2">Select Rarity:</label>
              <select name="rarity" id="rarity" className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md">
                <option value="Comun">Common</option>
                <option value="Poco Comun">Uncommon</option>
                <option value="Raro">Rare</option>
                <option value="Muy Raro">Epic</option>
                <option value="Legendario">Legendary</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="classNameification" className="block mb-2">Select Classification:</label>
              <select name="classification" id="classNameification"
                      className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md">
                <option value="Mayor">Major</option>
                <option value="Menor">Minor</option>
              </select>
            </div>

            <button id="generate-btn"
                    className="theme-btn px-4 py-2 text-black font-bold rounded-md w-full hover:bg-yellow-600 transition">
              Generate
            </button>
          </form>
        </section>

        {generatedItem &&
          <section className="max-w-lg mx-auto p-6 mt-8 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Generated Item</h2>

            <div id="generated-item-card" className="p-4 bg-gray-700 rounded-lg text-center">
              <h3 className="text-xl font-semibold"><a href={generatedItem["Url"]} target="_blank" rel="noreferrer">{generatedItem["Item name"]}</a></h3>
              <p className="mt-2"><strong>Rarity:</strong> {generatedItem["Rarity"]}</p>
              <p className="mt-2"><strong>Classification:</strong> {generatedItem["Clasificacion"]}</p>
            </div>
          </section>
        }

        <section className="mt-8">
          <h2 className="text-2xl mb-4 text-center">Generated Items</h2>

          <table className="min-w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Item Name</th>
              <th className="px-4 py-2 text-left">Rarity</th>
              <th className="px-4 py-2 text-left">Classification</th>
            </tr>
            </thead>
            <tbody id="items-table" className="bg-gray-600">
            {items.map(item => (
              <tr key={item["Item name"]}>
                <td><a href={item["Url"]} target="_blank" rel="noreferrer">{item["Item name"]}</a></td>
                <td>{item["Rarity"]}</td>
                <td>{item["Clasificacion"]}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
