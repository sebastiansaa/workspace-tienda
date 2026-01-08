//la api usa ids para las categorías
import { useRouter } from "vue-router"
import { useNavStore } from "@/stores";
import { logger } from "../services/logger";


export const useNavigation = () => {

  const router = useRouter();
  const navStore = useNavStore(); // setCategory,    setCurrentSection,

  const handleCategory = (categoryId: number) => {
    logger.debug(`[useNavigation] Navigating to category: ${categoryId}`)
    navStore.setCategory(categoryId);
    router.push(`/products/${categoryId}`);
  }

  const handleSection = (section: string) => {
    logger.debug(`[useNavigation] Navigating to section: ${section}`)
    navStore.setCurrentSection(section)
    switch (section) {
      case 'about':
        router.push('/about');
        break;
      case 'stores':
        router.push('/stores');
        break;
      case 'payment':
        router.push('/payment');
        break;
      case 'cart':
        router.push('/cart');
        break;
      case 'search':
        router.push('/search');
        break;
      case 'home':
        router.push('/');
        break;
      default:
        logger.warn(`[useNavigation] Unknown section: ${section}`)
        break;
    }
  }

  return {
    handleCategory,
    handleSection,

    navStore, // return este store para acceder a estado de navegación
    router  // return router por si se necesita exponer el obj router
  }
}
