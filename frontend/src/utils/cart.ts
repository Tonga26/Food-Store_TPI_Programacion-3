import type { IProduct } from "../types/IProduct";
import type { ICartItem } from "../types/ICartItem";

// LECTURA DE DATOS DEL LOCAL STORAGE
export const getCart = (): ICartItem[] => {
  const productosCarrito = localStorage.getItem("foodstore_cart");

  if (productosCarrito) {
    return JSON.parse(productosCarrito);
  }
  
  return [];
};

// INSERCIÓN Y/O AUMENTO DE PRODUCTOS EN EL CARRITO
export const addProductToCart = (productToAdd: IProduct) => {
  const cart = getCart();

  const existingItemIndex = cart.findIndex((item) => item.producto.id === productToAdd.id);

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].cantidad += 1;
  } else {
    cart.push({
      producto: productToAdd,
      cantidad: 1
    });
  }

  localStorage.setItem("foodstore_cart", JSON.stringify(cart));
};

// DISMINUCIÓN DE PRODUCTOS DEL CARRITO
export const decreaseProductFromCart = (productId: number) => {
  const cart = getCart();

  const existingItemIndex = cart.findIndex(item => productId === item.producto.id);

  if (existingItemIndex >= 0) {
    if (cart[existingItemIndex].cantidad > 1) {
      cart[existingItemIndex].cantidad -= 1;
    } else {
      cart.splice(existingItemIndex, 1);
    }
  }

  localStorage.setItem("foodstore_cart", JSON.stringify(cart));
};

// ELIMINACIÓN DE ITEM DEL CARRITO
export const deleteProductFromCart = (productId: number) => {
    const cart = getCart();

    const existingItemIndex = cart.findIndex(item => productId === item.producto.id);

    if (existingItemIndex >= 0) cart.splice(existingItemIndex, 1);

    localStorage.setItem("foodstore_cart", JSON.stringify(cart));
};