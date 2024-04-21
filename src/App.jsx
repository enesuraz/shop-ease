import { useState } from "react";

function App() {
  const [items, setItems] = useState([]);

  function handleAddItem(newItem) {
    setItems((oldItems) => [...oldItems, newItem]);
  }

  function handleDeleteItem(id) {
    setItems((oldItems) => oldItems.filter((oldItem) => oldItem.id !== id));
  }

  function handlePackedItem(id) {
    setItems((oldItems) =>
      oldItems.map((oldItem) =>
        oldItem.id === id ? { ...oldItem, packed: !oldItem.packed } : oldItem
      )
    );
  }

  function handleClearItems() {
    setItems([]);
  }

  return (
    <div className="app">
      <Sidebar onAddItem={handleAddItem} />
      <div className="main-container">
        <Main
          items={items}
          onDeleteItem={handleDeleteItem}
          onPackedItem={handlePackedItem}
          onClearItems={handleClearItems}
        />
        <Footer items={items} />
      </div>
    </div>
  );
}

function Sidebar({ onAddItem }) {
  return (
    <div className="sidebar">
      <Logo />
      <Form onAddItem={onAddItem} />
    </div>
  );
}

function Logo() {
  return <h1 className="logo">ShopEase</h1>;
}

function Form({ onAddItem }) {
  const [name, setName] = useState("");
  const [pieceType, setPieceType] = useState("kg");
  const [amount, setAmount] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      name,
      amount: `${amount} ${pieceType}`,
      packed: false,
    };

    setAmount(1);
    setName("");
    setPieceType("kg");

    console.log(newItem);
    onAddItem(newItem);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What do you need?"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={pieceType} onChange={(e) => setPieceType(e.target.value)}>
        <option value="kg">Kg</option>
        <option value="piece">Piece</option>
        <option value="liter">Liter</option>
      </select>
      <select value={amount} onChange={(e) => setAmount(e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => (
          <option value={i + 1} key={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <input type="submit" value="Shop" />
    </form>
  );
}
function Main({ items, onDeleteItem, onPackedItem, onClearItems }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "name")
    sortedItems = items.slice().sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(b.packed) - Number(a.packed));

  return (
    <div className="main">
      <ul className="item-list">
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onPackedItem={onPackedItem}
          />
        ))}
      </ul>
      <div className="stats">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by Input</option>
          <option value="name">Sort by Name</option>
          <option value="packed">Sort by Packed</option>
        </select>
        <button className="btn" onClick={onClearItems}>
          Clear All
        </button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onPackedItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onPackedItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.amount} {item.name}
      </span>
      <button className="item-btn" onClick={() => onDeleteItem(item.id)}>
        &times;
      </button>
    </li>
  );
}

function Footer({ items }) {
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentageItems = Math.round((packedItems / numItems) * 100);

  if (!numItems)
    return (
      <footer className="footer">
        <p>Start adding item to your shopping list</p>
      </footer>
    );

  return (
    <footer className="footer">
      <p>
        {percentageItems === 100
          ? "You got Everything"
          : `You have ${numItems} items on your list,You already packed ${packedItems}
        (${percentageItems}%)`}
      </p>
    </footer>
  );
}

export default App;
