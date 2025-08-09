// src/functionality/usePackages.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
import { API_URL } from '../../config';
import { useTranslation } from 'react-i18next';

export default function usePackages() {
  const {
    data: fetchedPackages = [],
    loading,
    error,
    retry,
  } = useFetch(`${API_URL}/package`, []);
  const { t } = useTranslation(); // Initialize translation hook to get `t`
  const [packages, setPackages] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (Array.isArray(fetchedPackages)) {
      setPackages(fetchedPackages.map((p) => ({ ...p, selectedQty: 1 })));
    }
  }, [fetchedPackages]);

  const handleSort = (option) => setSortOption(option);

  const getSortedPackages = () => {
    const sorted = [...packages];
    if (sortOption === 'priceHigh')
      return sorted.sort((a, b) => b.price - a.price);
    if (sortOption === 'priceLow')
      return sorted.sort((a, b) => a.price - b.price);
    if (sortOption === 'name')
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOption === 'newest')
      return sorted.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        if (isNaN(dateA) || isNaN(dateB)) return b.id - a.id;
        return dateB - dateA;
      });
    return sorted;
  };

  const adjustQty = (id, delta) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.min(
            Math.max((p.selectedQty || 1) + delta, 1),
            p.quantity
          );
          return { ...p, selectedQty: newQty };
        }
        return p;
      })
    );
  };

  const handleAddToCart = async (pack, qty = 1) => {
    if (pack.quantity < qty) {
      showOverlay(t('Not enough stock available'));
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsToAdd = Array.from({ length: qty }, () => ({
      id: pack.id,
      name: pack.title,
      description: pack.description,
      price: pack.price,
      image_url: pack.image_url,
      type: 'package',
    }));
    localStorage.setItem('cart', JSON.stringify([...cart, ...itemsToAdd]));

    try {
      await axios.patch(`${API_URL}/package/${pack.id}/decrease`, {
        qty,
      });
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pack.id
            ? { ...p, quantity: p.quantity - qty, selectedQty: 1 }
            : p
        )
      );
      showOverlay(`${pack.title} x${qty} ${t('added to cart')}`);
    } catch (err) {
      console.error('Error updating quantity:', err);
      showOverlay(t('Failed to update quantity'));
    }
  };

  const showOverlay = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  return {
    packages,
    loading,
    error,
    retry,
    successMessage,
    sortOption,
    handleSort,
    getSortedPackages,
    adjustQty,
    handleAddToCart,
    showOverlay,
  };
}
