export type MenuItem = {
  label: string;
  href: string;
  id?: string;
  className?: string;
};

export type MenuPage = "store" | "cart" | "admin";