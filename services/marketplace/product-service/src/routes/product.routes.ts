import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const productController = new ProductController();

// Product search & autocomplete
router.get('/search', productController.searchProducts);
router.get('/autocomplete', productController.autocomplete);

// Product CRUD
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id/similar', productController.getSimilarProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Stock management
router.post('/:id/stock', productController.updateStock);

// Categories
router.get('/categories/list', productController.getCategories);

// Price history
router.get('/:id/price-history', productController.getPriceHistory);

export default router;
