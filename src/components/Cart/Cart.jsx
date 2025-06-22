"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button/Button";
import { useCart } from "@/contexts/CartContext";
import { clearStorage } from "@/utils/storageUtil";
import { createOrder } from "@/api/api";

export const Cart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    customerPhone = "",
    updateCustomerPhone,
    resetContext,
  } = useCart();
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    const input = event.target.value.replace(/\D/g, "");
    let formattedInputValue = "+7";

    if (input.length > 1) {
      formattedInputValue += " (" + input.substring(1, 4);
    }
    if (input.length > 4) {
      formattedInputValue += ") " + input.substring(4, 7);
    }
    if (input.length > 7) {
      formattedInputValue += "-" + input.substring(7, 9);
    }
    if (input.length > 9) {
      formattedInputValue += "-" + input.substring(9, 11);
    }

    updateCustomerPhone(formattedInputValue);
    setError(false);
  };

  const handleSubmit = async () => {
    if (customerPhone.replace(/\D/g, "").length === 11) {
      if (cartItems.length > 0) {
        const items = cartItems.map((item) => ({
          id: item.id,
          quantity: item.count,
        }));
        const digitsOnly = customerPhone.replace(/\D/g, "");
        const order = {
          phone: digitsOnly,
          cart: items,
        };
        try {
          const orderResponse = await createOrder(order);
          if (orderResponse.success === 1) {
            const dialog = document.getElementById("dialog");
            dialog.classList.remove("hidden");
            resetContext();
            setTimeout(() => {
              dialog.classList.add("hidden");
            }, 3000);
          }
          console.log(orderResponse);
        } catch (error) {
          console.error("Order error:", error);
        }
        console.log(order);
        clearStorage();
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000); // Remove error after 5 seconds
    }
  };

  useEffect(() => {
    console.log("cartItems", cartItems);
  }, [cartItems]);

  return (
    <div className="flex flex-col justify-start items-center sm:items-start bg-[#D9D9D9] rounded-2xl w-full md:w-full sm:max-w-[600px] px-3 py-2 gap-3 mb-11 sm:mx-auto">
      <h2 className="text-center sm:text-left text-black text-3xl">
        Добавленные товары
      </h2>

      {cartItems.map((item) => (
        <div
          className="w-full text-black grid grid-cols-[3fr_1fr_2fr_1fr] items-center gap-2 sm:max-w-[500px]"
          key={item.id}
        >
          <p className="text-nowrap truncate">{item.title}</p>
          <span className="text-nowrap truncate">{`x${item.count}`}</span>
          <span className="text-nowrap truncate">{`${
            item.price * item.count
          }₽`}</span>
          <button onClick={() => removeFromCart(item.id)}>Убрать</button>
        </div>
      ))}

      <div className="flex w-full justify-between items-center sm:items-end flex-col gap-2 sm:flex-row relative">
        <input
          className={`w-full h-14 placeholder:text-white text-2xl text-white bg-[#222] max-w-[300px] border-none rounded-2xl focus:ring-2 focus:ring-gray-300  sm:text-left px-3 mt-3 ${
            error ? "border-4 border-red-500" : ""
          }`}
          type="tel"
          value={customerPhone}
          onChange={handleChange}
          placeholder="+7 (__) ___ __-__"
        />
        {error && (
          <span className="absolute bottom-32 sm:bottom-14 sm:left-5 text-red-500">
            Телефон введен неполностью
          </span>
        )}
        <Button
          onClick={handleSubmit}
          disabled={cartItems.length === 0}
          size={"full"}
          title={"заказать"}
        />
      </div>
      <div
        id="dialog"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center hidden"
      >
        <div className="p-4  shadow-lg bg-[#D9D9D9] rounded-2xl w-full max-w-80 text-black h-32 flex justify-center items-center">
          <p className="">Заказ успешно создан!</p>
        </div>
      </div>
    </div>
  );
};
