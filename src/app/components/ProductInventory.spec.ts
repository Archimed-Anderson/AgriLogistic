import { describe, it, expect } from 'vitest';
import {
  mapInventoryRowToProduct,
  buildInventoryExportData,
  type Product,
} from './ProductInventory';

describe('mapInventoryRowToProduct', () => {
  it('retourne un produit valide pour une ligne complète', () => {
    const row = {
      Nom: 'Tomates Bio',
      SKU: 'VEG-TOM-001',
      Catégorie: 'Légumes',
      'Stock actuel': 50,
      'Point de réapprovisionnement': 10,
      'Stock maximum': 200,
      'Prix unitaire': 3.5,
      Fournisseur: 'Ferme Martin',
      Description: 'Tomates bio cultivées localement',
    };

    const result = mapInventoryRowToProduct(row, 1);

    expect(result.product).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.product?.id).toBe(1);
    expect(result.product?.name).toBe('Tomates Bio');
    expect(result.product?.sku).toBe('VEG-TOM-001');
    expect(result.product?.category).toBe('Légumes');
    expect(result.product?.currentStock).toBe(50);
    expect(result.product?.reorderPoint).toBe(10);
    expect(result.product?.maxStock).toBe(200);
    expect(result.product?.unitPrice).toBe(3.5);
    expect(result.product?.supplier).toBe('Ferme Martin');
    expect(result.product?.description).toBe('Tomates bio cultivées localement');
  });

  it('retourne une erreur si des champs obligatoires manquent', () => {
    const row = {
      SKU: 'VEG-TOM-001',
      Catégorie: 'Légumes',
      'Stock actuel': 50,
      'Point de réapprovisionnement': 10,
      'Stock maximum': 200,
      'Prix unitaire': 3.5,
    };

    const result = mapInventoryRowToProduct(row, 1);

    expect(result.product).toBeUndefined();
    expect(result.error).toBeDefined();
  });

  it('retourne une erreur si les valeurs numériques sont invalides', () => {
    const row = {
      Nom: 'Tomates Bio',
      SKU: 'VEG-TOM-001',
      Catégorie: 'Légumes',
      'Stock actuel': 'abc',
      'Point de réapprovisionnement': 10,
      'Stock maximum': 200,
      'Prix unitaire': 3.5,
    };

    const result = mapInventoryRowToProduct(row, 1);

    expect(result.product).toBeUndefined();
    expect(result.error).toBeDefined();
  });
});

describe('buildInventoryExportData', () => {
  it("construit les données d'export à partir des produits", () => {
    const products: Product[] = [
      {
        id: 1,
        name: 'Tomates Bio',
        sku: 'VEG-TOM-001',
        category: 'Légumes',
        currentStock: 50,
        reorderPoint: 10,
        maxStock: 200,
        unitPrice: 3.5,
        supplier: 'Ferme Martin',
        description: 'Tomates bio cultivées localement',
      },
    ];

    const exportData = buildInventoryExportData(products);

    expect(exportData).toHaveLength(1);
    expect(exportData[0]).toMatchObject({
      ID: 1,
      Nom: 'Tomates Bio',
      SKU: 'VEG-TOM-001',
      Catégorie: 'Légumes',
      'Stock actuel': 50,
      'Point de réapprovisionnement': 10,
      'Stock maximum': 200,
      'Prix unitaire (€)': 3.5,
      Fournisseur: 'Ferme Martin',
      Description: 'Tomates bio cultivées localement',
    });
  });
});
