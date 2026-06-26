import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";

const initPage = () => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};

initPage();

setupMenu("admin", "#nav-menu");