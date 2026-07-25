import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      // Puntos de entrada físicos requeridos para el empaquetado de producción (MPA)
      input: {
        index: resolve(__dirname, "index.html"),
        
        // Auth
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        register: resolve(__dirname, "src/pages/auth/register/register.html"),
        
        // Admin
        adminHome: resolve(__dirname, "src/pages/admin/adminHome/admin.html"),
        adminCategories: resolve(__dirname, "src/pages/admin/categories/categories.html"),
        adminProducts: resolve(__dirname, "src/pages/admin/products/products.html"),
        adminOrders: resolve(__dirname, "src/pages/admin/orders/orders.html"),
        
        // Store
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        storeCart: resolve(__dirname, "src/pages/store/cart/cart.html"),
        productDetail: resolve(__dirname, "src/pages/store/productDetail/productDetail.html"),
        
        // Client
        clientOrders: resolve(__dirname, "src/pages/client/orders/orders.html"),
      },
    },
  },
});