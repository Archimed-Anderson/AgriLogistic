import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  MoreVertical,
  Plus,
  Search,
  Edit,
  Copy,
  Archive,
  Trash2,
  Check,
  X,
  Image as ImageIcon,
  Upload,
  Eye,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  FileText,
  Tractor,
  Settings,
  Package,
  Loader2,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  productCount: number;
  icon?: string;
  description?: string;
  children?: Category[];
  expanded?: boolean;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  model: string;
  brand: string;
  categoryId: string;
  status: 'published' | 'draft' | 'archived';
  pricePerDay: number;
  pricePerWeek?: number;
  image?: string;
  description?: string;
  specifications?: Array<{ attribute: string; value: string }>;
}

export function CategoryManagement() {
  const [activeView, setActiveView] = useState<'categories' | 'all-products'>('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('CAT-002');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const selectedCategory = findCategoryById(categories, selectedCategoryId);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeView === 'all-products' || product.categoryId === selectedCategoryId;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const toggleCategory = (categoryId: string) => {
    setCategories(updateCategoryExpanded(categories, categoryId));
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleAddCategory = (parentId: string | null = null) => {
    setEditingCategory({
      id: '',
      name: '',
      parentId,
      productCount: 0,
      icon: '📁',
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory?.id) {
      // Update existing
      setCategories(updateCategory(categories, editingCategory.id, categoryData));
      toast.success('Catégorie mise à jour');
    } else {
      // Create new
      const newCategory: Category = {
        id: `CAT-${Date.now()}`,
        name: categoryData.name || 'Nouvelle catégorie',
        parentId: categoryData.parentId || null,
        productCount: 0,
        icon: categoryData.icon || '📁',
        description: categoryData.description,
      };
      setCategories([...categories, newCategory]);
      toast.success(`Catégorie "${newCategory.name}" créée avec succès`);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleAddProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      sku: '',
      model: '',
      brand: '',
      categoryId: selectedCategoryId || '',
      status: 'draft',
      pricePerDay: 0,
      specifications: [
        { attribute: 'Puissance (ch)', value: '' },
        { attribute: 'Largeur de travail (m)', value: '' },
      ],
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct?.id) {
      // Update
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)));
      toast.success('Produit mis à jour');
    } else {
      // Create
      const newProduct: Product = {
        id: `PROD-${Date.now()}`,
        name: productData.name || 'Nouveau produit',
        sku: productData.sku || `SKU-${Date.now()}`,
        model: productData.model || '',
        brand: productData.brand || '',
        categoryId: productData.categoryId || selectedCategoryId || '',
        status: productData.status || 'draft',
        pricePerDay: productData.pricePerDay || 0,
        pricePerWeek: productData.pricePerWeek,
        description: productData.description,
        specifications: productData.specifications || [],
      };
      setProducts([...products, newProduct]);

      // Update category product count
      setCategories(updateCategoryProductCount(categories, newProduct.categoryId, 1));

      toast.success(`Produit "${newProduct.name}" ajouté avec succès !`);

      // Select the category to show the new product
      setSelectedCategoryId(newProduct.categoryId);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setProducts(products.filter((p) => p.id !== productId));
      setCategories(updateCategoryProductCount(categories, product.categoryId, -1));
      toast.success('Produit supprimé');
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `PROD-${Date.now()}`,
      name: `${product.name} (copie)`,
      sku: `${product.sku}-COPY`,
    };
    setProducts([...products, newProduct]);
    setCategories(updateCategoryProductCount(categories, newProduct.categoryId, 1));
    toast.success('Produit dupliqué');
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('Sélectionnez au moins un produit');
      return;
    }

    switch (action) {
      case 'publish':
        setProducts(
          products.map((p) =>
            selectedProducts.includes(p.id) ? { ...p, status: 'published' as const } : p
          )
        );
        toast.success(`${selectedProducts.length} produit(s) publié(s)`);
        break;
      case 'archive':
        setProducts(
          products.map((p) =>
            selectedProducts.includes(p.id) ? { ...p, status: 'archived' as const } : p
          )
        );
        toast.success(`${selectedProducts.length} produit(s) archivé(s)`);
        break;
    }
    setSelectedProducts([]);
  };

  const handleMoveCategory = (draggedId: string, targetId: string) => {
    // Find dragged category
    const draggedCategory = findCategoryById(categories, draggedId);
    if (!draggedCategory || draggedId === targetId) return;

    // Update parent
    const updatedCategories = categories.map((cat) =>
      cat.id === draggedId ? { ...cat, parentId: targetId } : cat
    );

    setCategories(updatedCategories);
    toast.success(`"${draggedCategory.name}" déplacé avec succès`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Catégories & Produits</h1>
          <p className="text-muted-foreground mt-2">
            Organisez et gérez votre catalogue d'équipements
          </p>
        </div>

        {/* View Tabs */}
        <div className="border-b">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveView('categories')}
              className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
                activeView === 'categories'
                  ? 'border-[#2563eb] text-[#2563eb]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Vue Catégories
              </span>
            </button>
            <button
              onClick={() => setActiveView('all-products')}
              className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
                activeView === 'all-products'
                  ? 'border-[#2563eb] text-[#2563eb]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Vue Tous les produits
              </span>
            </button>
          </nav>
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Category Tree (only in categories view) */}
          {activeView === 'categories' && (
            <div className="lg:col-span-1">
              <CategoryTreePanel
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={handleSelectCategory}
                onToggleCategory={toggleCategory}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onMoveCategory={handleMoveCategory}
              />
            </div>
          )}

          {/* Right Panel - Products Table */}
          <div className={activeView === 'categories' ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <ProductsTablePanel
              products={filteredProducts}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onDuplicateProduct={handleDuplicateProduct}
              selectedProducts={selectedProducts}
              onSelectProducts={setSelectedProducts}
              onBulkAction={handleBulkAction}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              viewMode={activeView}
            />
          </div>
        </div>

        {/* Modals */}
        {showCategoryModal && (
          <CategoryModal
            category={editingCategory}
            categories={categories}
            onClose={() => {
              setShowCategoryModal(false);
              setEditingCategory(null);
            }}
            onSave={handleSaveCategory}
          />
        )}

        {showProductModal && (
          <ProductModal
            product={editingProduct}
            categories={categories}
            onClose={() => {
              setShowProductModal(false);
              setEditingProduct(null);
            }}
            onSave={handleSaveProduct}
          />
        )}
      </div>
    </DndProvider>
  );
}

// Category Tree Panel Component
function CategoryTreePanel({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onToggleCategory,
  onAddCategory,
  onEditCategory,
  onMoveCategory,
}: any) {
  return (
    <div className="bg-muted/30 border rounded-lg p-4 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Folder className="h-4 w-4 text-[#2563eb]" />
          Arborescence des Catégories
        </h2>
        <button
          onClick={() => onAddCategory(null)}
          className="p-1.5 hover:bg-background rounded transition-colors text-[#2563eb]"
          title="+ Nouvelle catégorie racine"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {categories
          .filter((cat: Category) => !cat.parentId)
          .map((category: Category) => (
            <CategoryTreeNode
              key={category.id}
              category={category}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
              onToggleCategory={onToggleCategory}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onMoveCategory={onMoveCategory}
              level={0}
            />
          ))}
      </div>
    </div>
  );
}

// Category Tree Node Component
function CategoryTreeNode({
  category,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onToggleCategory,
  onAddCategory,
  onEditCategory,
  onMoveCategory,
  level,
}: any) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const hasChildren = categories.some((cat: Category) => cat.parentId === category.id);
  const isSelected = selectedCategoryId === category.id;
  const isExpanded = category.expanded;

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'CATEGORY',
    item: { id: category.id, name: category.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CATEGORY',
    canDrop: (item: any) => item.id !== category.id,
    drop: (item: any) => {
      onMoveCategory(item.id, category.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop}>
      <div
        ref={dragPreview}
        onClick={() => onSelectCategory(category.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowContextMenu(!showContextMenu);
        }}
        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors group relative ${
          isSelected ? 'bg-[#2563eb] text-white' : 'hover:bg-background'
        } ${isDragging ? 'opacity-50' : ''} ${
          isOver && canDrop ? 'ring-2 ring-[#2563eb] ring-offset-2' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Drag Handle */}
        <div
          ref={drag}
          className={`cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity ${
            isSelected ? 'text-white' : 'text-muted-foreground'
          }`}
        >
          <GripVertical className="h-3 w-3" />
        </div>

        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCategory(category.id);
            }}
            className="hover:bg-muted/50 rounded p-0.5"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Icon */}
        <span className="text-base">{category.icon || '📁'}</span>

        {/* Name */}
        <span className="flex-1 text-sm truncate">{category.name}</span>

        {/* Product Count Badge */}
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
            isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          {category.productCount}
        </span>

        {/* Context Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowContextMenu(!showContextMenu);
          }}
          className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-opacity ${
            isSelected ? 'text-white hover:bg-white/20' : ''
          }`}
        >
          <MoreVertical className="h-3 w-3" />
        </button>
      </div>

      {/* Context Menu Dropdown */}
      {showContextMenu && (
        <div className="ml-8 mt-1 bg-card border rounded-lg shadow-lg p-1 text-sm z-10 relative">
          <button
            onClick={() => {
              onAddCategory(category.id);
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-muted rounded flex items-center gap-2"
          >
            <Plus className="h-3 w-3" />
            Ajouter sous-catégorie
          </button>
          <button
            onClick={() => {
              onEditCategory(category);
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-muted rounded flex items-center gap-2"
          >
            <Edit className="h-3 w-3" />
            Renommer
          </button>
          <button
            onClick={() => {
              toast.success('Catégorie archivée');
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-muted rounded flex items-center gap-2 text-red-600"
          >
            <Archive className="h-3 w-3" />
            Archiver
          </button>
        </div>
      )}

      {/* Children */}
      {isExpanded &&
        hasChildren &&
        categories
          .filter((cat: Category) => cat.parentId === category.id)
          .map((child: Category) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
              onToggleCategory={onToggleCategory}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onMoveCategory={onMoveCategory}
              level={level + 1}
            />
          ))}
    </div>
  );
}

// Products Table Panel Component
function ProductsTablePanel({
  products,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onDuplicateProduct,
  selectedProducts,
  onSelectProducts,
  onBulkAction,
  statusFilter,
  onStatusFilterChange,
  viewMode,
}: any) {
  const toggleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onSelectProducts(selectedProducts.filter((id: string) => id !== productId));
    } else {
      onSelectProducts([...selectedProducts, productId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      onSelectProducts([]);
    } else {
      onSelectProducts(products.map((p: Product) => p.id));
    }
  };

  return (
    <div className="bg-card border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">
              {viewMode === 'categories' && selectedCategory
                ? `Produits de la Catégorie : ${selectedCategory.name}`
                : 'Tous les produits'}
            </h2>
            <p className="text-sm text-muted-foreground">{products.length} produit(s)</p>
          </div>
          <button
            onClick={onAddProduct}
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="archived">Archivés</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">{selectedProducts.length} sélectionné(s)</span>
            <div className="flex gap-2">
              <button
                onClick={() => onBulkAction('publish')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Publier la sélection
              </button>
              <button
                onClick={() => onBulkAction('archive')}
                className="px-3 py-1 border rounded text-sm hover:bg-muted transition-colors"
              >
                Archiver
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold text-lg mb-2">Aucun produit</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory
                ? `Ajoutez votre premier équipement à louer dans la catégorie "${selectedCategory.name}".`
                : 'Ajoutez votre premier équipement à louer.'}
            </p>
            <button
              onClick={onAddProduct}
              className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Produit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Modèle/Marque</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Taux de location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded flex items-center justify-center text-2xl">
                        {getCategoryIcon(product.categoryId)}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {product.brand && <div className="font-medium">{product.brand}</div>}
                      {product.model && (
                        <div className="text-muted-foreground">{product.model}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'published' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" />
                        Publié
                      </span>
                    )}
                    {product.status === 'draft' && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
                        <FileText className="h-3 w-3" />
                        Brouillon
                      </span>
                    )}
                    {product.status === 'archived' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
                        <Archive className="h-3 w-3" />
                        Archivé
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#2563eb]">{product.pricePerDay}€</div>
                    <div className="text-xs text-muted-foreground">par jour</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Éditer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDuplicateProduct(product)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Dupliquer"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer ce produit ?')) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="p-2 hover:bg-muted rounded transition-colors text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Category Modal Component
function CategoryModal({ category, categories, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    parentId: category?.parentId || '',
    icon: category?.icon || '📁',
    description: category?.description || '',
  });

  const iconOptions = ['📁', '🚜', '🥚', '🚛', '🪚', '💧', '🔧', '📦', '🌾', '🐄'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {category?.id ? 'Éditer la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de la catégorie *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
              placeholder="Ex: Tracteurs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Catégorie parente</label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            >
              <option value="">Aucune (catégorie racine)</option>
              {categories
                .filter((cat: Category) => cat.id !== category?.id)
                .map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Icône</label>
            <div className="grid grid-cols-10 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`text-2xl p-2 border rounded hover:bg-muted transition-colors ${
                    formData.icon === icon ? 'ring-2 ring-[#2563eb]' : ''
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
              placeholder="Description optionnelle..."
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.name}
            className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {category?.id ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({ product, categories, onClose, onSave }: any) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    brand: product?.brand || '',
    model: product?.model || '',
    categoryId: product?.categoryId || '',
    status: product?.status || 'draft',
    pricePerDay: product?.pricePerDay || 0,
    pricePerWeek: product?.pricePerWeek || 0,
    description: product?.description || '',
    specifications: product?.specifications || [
      { attribute: 'Puissance (ch)', value: '' },
      { attribute: 'Largeur de travail (m)', value: '' },
    ],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSaving(false);
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { attribute: '', value: '' }],
    });
  };

  const updateSpecification = (index: number, field: 'attribute' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSpecification = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_: any, i: number) => i !== index),
    });
  };

  const tabs = [
    { id: 'basic', label: 'Infos de base', icon: FileText },
    { id: 'specs', label: 'Spécifications', icon: Settings },
    { id: 'media', label: 'Galerie', icon: ImageIcon },
    { id: 'pricing', label: 'Tarification', icon: Package },
    { id: 'preview', label: 'Aperçu', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {product?.id ? 'Éditer le produit' : 'Nouveau produit'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-muted/30 px-6">
          <nav className="flex gap-6 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#2563eb] text-[#2563eb]'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'basic' && (
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Nom du produit *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="Ex: Tracteur John Deere 6155M"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Référence SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="SKU-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Marque</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="Ex: John Deere"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Modèle</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="Ex: 6155M"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
                    placeholder="Description détaillée du produit..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Spécifications techniques</h3>
                <button
                  onClick={addSpecification}
                  className="px-3 py-1.5 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un champ
                </button>
              </div>

              <div className="space-y-3">
                {formData.specifications.map((spec: any, index: number) => (
                  <div key={index} className="flex gap-3 items-start">
                    <input
                      type="text"
                      value={spec.attribute}
                      onChange={(e) => updateSpecification(index, 'attribute', e.target.value)}
                      placeholder="Ex: Puissance (ch)"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      placeholder="Ex: 220"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                    <button
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {formData.specifications.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Aucune spécification. Cliquez sur "+ Ajouter un champ" pour commencer.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4 max-w-2xl">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Zone de drag & drop</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Glissez-déposez vos images ici ou cliquez pour parcourir
                </p>
                <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors">
                  Parcourir les fichiers
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prix par jour (€) *</label>
                  <input
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="450"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prix par semaine (€)</label>
                  <input
                    type="number"
                    value={formData.pricePerWeek}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerWeek: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="2800"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Astuce :</strong> Un tarif hebdomadaire attractif encourage les
                  locations longue durée
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="max-w-2xl">
              <div className="bg-muted/50 border-2 border-dashed rounded-lg p-8">
                <h3 className="text-center font-semibold mb-4">Aperçu de la fiche produit</h3>
                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-6xl">
                    {getCategoryIcon(formData.categoryId)}
                  </div>
                  <div className="p-6 space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold">{formData.name || 'Nom du produit'}</h2>
                      <p className="text-muted-foreground">{formData.model || formData.brand}</p>
                    </div>
                    {formData.description && (
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    )}
                    {formData.specifications.length > 0 && (
                      <div className="pt-3 border-t">
                        <h4 className="text-sm font-semibold mb-2">Spécifications</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {formData.specifications
                            .filter((s: any) => s.attribute && s.value)
                            .map((spec: any, i: number) => (
                              <div key={i}>
                                <span className="text-muted-foreground">{spec.attribute}:</span>{' '}
                                <span className="font-medium">{spec.value}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-3xl font-bold text-[#2563eb]">
                          {formData.pricePerDay}€
                        </div>
                        <div className="text-sm text-muted-foreground">par jour</div>
                      </div>
                      {formData.pricePerWeek > 0 && (
                        <div className="text-right">
                          <div className="text-xl font-semibold">{formData.pricePerWeek}€</div>
                          <div className="text-xs text-muted-foreground">par semaine</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/30">
          <div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Statut :</span>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-3 py-1.5 border rounded bg-background font-medium"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-background transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.categoryId || isSaving}
              className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {formData.status === 'published' ? 'Publication...' : 'Sauvegarde...'}
                </>
              ) : (
                <>{formData.status === 'published' ? 'Publier' : 'Sauvegarder'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function findCategoryById(categories: Category[], id: string | null): Category | undefined {
  if (!id) return undefined;
  return categories.find((cat) => cat.id === id);
}

function updateCategoryExpanded(categories: Category[], id: string): Category[] {
  return categories.map((cat) => (cat.id === id ? { ...cat, expanded: !cat.expanded } : cat));
}

function updateCategory(
  categories: Category[],
  id: string,
  updates: Partial<Category>
): Category[] {
  return categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat));
}

function updateCategoryProductCount(
  categories: Category[],
  categoryId: string,
  delta: number
): Category[] {
  return categories.map((cat) =>
    cat.id === categoryId ? { ...cat, productCount: cat.productCount + delta } : cat
  );
}

function getCategoryIcon(categoryId: string): string {
  const icons: Record<string, string> = {
    'CAT-001': '🚜',
    'CAT-002': '🚜',
    'CAT-003': '🌾',
    'CAT-004': '🥚',
    'CAT-005': '🐄',
    'CAT-006': '🌾',
  };
  return icons[categoryId] || '📦';
}

// Initial mock data - Updated structure
const initialCategories: Category[] = [
  {
    id: 'CAT-001',
    name: 'Machinerie Lourde',
    parentId: null,
    productCount: 17,
    icon: '🚜',
    expanded: true,
    description: 'Équipements agricoles lourds et motorisés',
  },
  {
    id: 'CAT-002',
    name: 'Tracteurs',
    parentId: 'CAT-001',
    productCount: 12,
    icon: '🚜',
    expanded: false,
    description: 'Tracteurs de toutes puissances',
  },
  {
    id: 'CAT-003',
    name: 'Moissonneuses-batteuses',
    parentId: 'CAT-001',
    productCount: 5,
    icon: '🌾',
    expanded: false,
    description: 'Moissonneuses pour céréales',
  },
  {
    id: 'CAT-004',
    name: 'Élevage & Aviculture',
    parentId: null,
    productCount: 8,
    icon: '🥚',
    expanded: true,
    description: "Matériel pour l'élevage",
  },
  {
    id: 'CAT-005',
    name: 'Couveuses',
    parentId: 'CAT-004',
    productCount: 8,
    icon: '🥚',
    expanded: false,
    description: 'Couveuses automatiques et manuelles',
  },
];

const initialProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Tracteur John Deere 6155M',
    sku: 'JD-6155M-001',
    model: '6155M',
    brand: 'John Deere',
    categoryId: 'CAT-002',
    status: 'published',
    pricePerDay: 420,
    pricePerWeek: 2520,
    description: 'Tracteur polyvalent 155 CV avec cabine climatisée',
    specifications: [
      { attribute: 'Puissance (ch)', value: '155' },
      { attribute: 'Largeur de travail (m)', value: '3.2' },
    ],
  },
  {
    id: 'PROD-002',
    name: 'Tracteur Massey Ferguson 7718',
    sku: 'MF-7718-001',
    model: '7718 S',
    brand: 'Massey Ferguson',
    categoryId: 'CAT-002',
    status: 'published',
    pricePerDay: 380,
    pricePerWeek: 2280,
    specifications: [
      { attribute: 'Puissance (ch)', value: '180' },
      { attribute: 'Poids (kg)', value: '8500' },
    ],
  },
  {
    id: 'PROD-003',
    name: 'Tracteur New Holland T7.270',
    sku: 'NH-T7270-001',
    model: 'T7.270',
    brand: 'New Holland',
    categoryId: 'CAT-002',
    status: 'draft',
    pricePerDay: 450,
    specifications: [{ attribute: 'Puissance (ch)', value: '270' }],
  },
  {
    id: 'PROD-004',
    name: 'Couveuse Automatique 456 Œufs',
    sku: 'INC-456-001',
    model: 'REAL 49 Plus',
    brand: 'Borotto',
    categoryId: 'CAT-005',
    status: 'published',
    pricePerDay: 35,
    pricePerWeek: 210,
    specifications: [
      { attribute: 'Capacité (œufs)', value: '456' },
      { attribute: 'Consommation (W)', value: '150' },
    ],
  },
  {
    id: 'PROD-005',
    name: 'Couveuse Professionnelle 300 Œufs',
    sku: 'INC-300-001',
    model: 'Pro 300',
    brand: 'Incubex',
    categoryId: 'CAT-005',
    status: 'published',
    pricePerDay: 28,
    specifications: [{ attribute: 'Capacité (œufs)', value: '300' }],
  },
  {
    id: 'PROD-006',
    name: 'Moissonneuse-batteuse CLAAS Lexion 780',
    sku: 'CLAAS-LEX780-001',
    model: 'Lexion 780',
    brand: 'CLAAS',
    categoryId: 'CAT-003',
    status: 'published',
    pricePerDay: 850,
    pricePerWeek: 5100,
    specifications: [
      { attribute: 'Puissance (ch)', value: '530' },
      { attribute: 'Largeur de coupe (m)', value: '9.2' },
    ],
  },
];
