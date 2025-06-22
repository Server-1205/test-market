"use client";
import Image from "next/image";
import { FormCounter } from "@/components/FormCounter/FormCounter";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button/Button";
import { useCart } from "@/contexts/CartContext";

export const Card = ({ product }) => {
  const { description, image_url, price, title } = product;

  const { cartItems, addToCart, removeFromCart } = useCart();

  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    if (count > 0) {
      addToCart(product, count);
    } else {
      removeFromCart(product.id);
    }
  }, [count]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setCount(cartItems.length);
    }
  }, [cartItems]);

  return (
    <div className="flex flex-col justify-start items-center bg-[#D9D9D9] rounded-2xl w-full max-w-sm sm:max-w-[301px] px-2.5 py-2 gap-2">
      <Image
        src={image_url}
        alt="Описание изображения"
        width={309}
        height={366}
        unoptimized={true}
        className="rounded-2xl object-center object-contain w-full"
      />
      <h2 className="text-black text-4xl word-wrap overflow text-overflow white-space title text-left">
        {title}
      </h2>
      <p className="w-full text-black mb-auto desc">{description}</p>
      <span className="text-black text-2xl mt-auto">{`ценa: ${price}₽`}</span>
      {count >= 1 ? (
        <FormCounter
          setCount={setCount}
          count={count}
          increment={increment}
          decrement={decrement}
        />
      ) : (
        <Button onClick={increment} size={"full"} title={"купить"} />
      )}
    </div>
  );
};
