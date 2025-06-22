"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts, getReviews } from "@/api/api";
import { Cart } from "@/components/Cart/Cart";
import { Review } from "@/components/Review/Review";
import { ProductList } from "@/components/ProductList/ProductList";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const observer = useRef();
  const sentinelRef = useRef(null);

  const loadProducts = useCallback(async () => {
    if (isLoading || page * 20 > total) return;

    setIsLoading(true);
    const newProducts = await getProducts(page, 20);

    setProducts((prev) => [...prev, ...newProducts.items]);
    setTotal(newProducts.total);
    setIsLoading(false);
  }, [isLoading, page, total]);

  useEffect(() => {
    const fetchData = async () => {
      const [productsData, reviewsData] = await Promise.all([
        getProducts(),
        getReviews(),
      ]);
      setProducts(productsData.items);
      setReviews(reviewsData);
      setTotal(productsData.total);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      await loadProducts();
    };

    fetchProducts();
  }, [page]);

  useEffect(() => {
    const callback = (entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(callback);
    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.current.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.current.unobserve(currentSentinel);
      }
    };
  }, [isLoading]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-32">
      <Review reviews={reviews} />
      <div className="w-full flex flex-col justify-center items-center">
        <Cart />
        <ProductList products={products}/>
        <div ref={sentinelRef} className="h-20" />
      </div>
    </main>
  );
}