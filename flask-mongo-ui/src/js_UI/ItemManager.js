import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemManager = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', value: '' });
    const [updateItem, setUpdateItem] = useState({ id: '', name: '', value: '' });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/get_items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleCreateItem = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/create_item', newItem);
            fetchItems();
            setNewItem({ name: '', value: '' });
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    const handleUpdateItem = async () => {
        try {
            await axios.put(`http://127.0.0.1:5000/update_item/${updateItem.id}`, {
                name: updateItem.name,
                value: updateItem.value,
            });
            fetchItems();
            setUpdateItem({ id: '', name: '', value: '' });
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div>
            <h1>Item Manager</h1>
            <div>
                <h2>Create Item</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Value"
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                />
                <button onClick={handleCreateItem}>Create</button>
            </div>
            <div>
                <h2>Update Item</h2>
                <input
                    type="text"
                    placeholder="ID"
                    value={updateItem.id}
                    onChange={(e) => setUpdateItem({ ...updateItem, id: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={updateItem.name}
                    onChange={(e) => setUpdateItem({ ...updateItem, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Value"
                    value={updateItem.value}
                    onChange={(e) => setUpdateItem({ ...updateItem, value: e.target.value })}
                />
                <button onClick={handleUpdateItem}>Update</button>
            </div>
            <div>
                <h2>Items</h2>
                <ul>
                    {items.map((item) => (
                        <li key={item._id}>
                            {item.name}: {item.value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ItemManager;