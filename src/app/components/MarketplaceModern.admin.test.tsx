import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { MarketplaceModern } from '@components/MarketplaceModern';

vi.mock('sonner', () => {
  const toast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  });
  return { toast };
});

describe('MarketplaceModern admin tab', () => {
  beforeAll(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
  });

  afterAll(() => {
    (URL.createObjectURL as unknown as any).mockRestore();
  });

  test.skip('validates required admin fields in real time', async () => {
    render(<MarketplaceModern adminMode />);

    const productCards = await screen.findAllByTestId('product-card');
    fireEvent.click(productCards[0]);

    const detailPanel = await screen.findByTestId('product-detail-panel');
    expect(detailPanel).toBeTruthy();

    const adminTab = await screen.findByTestId('product-tab-admin');
    fireEvent.click(adminTab);

    const skuInput = await screen.findByTestId('admin-sku-input');
    fireEvent.change(skuInput, { target: { value: '' } });

    const saveButton = await screen.findByTestId('admin-save');
    fireEvent.click(saveButton);

    const errorLabel = await screen.findByText('SKU obligatoire');
    expect(errorLabel).toBeTruthy();
  });

  test.skip('handles media drag-and-drop reordering in DOM', async () => {
    render(<MarketplaceModern adminMode />);

    const productCards = await screen.findAllByTestId('product-card');
    fireEvent.click(productCards[0]);

    const detailPanel = await screen.findByTestId('product-detail-panel');
    expect(detailPanel).toBeTruthy();

    const adminTab = await screen.findByTestId('product-tab-admin');
    fireEvent.click(adminTab);

    const fileInput = await screen.findByTestId('admin-media-input');

    const file1 = new File(['file-1'], 'file-1.png', { type: 'image/png' });
    const file2 = new File(['file-2'], 'file-2.png', { type: 'image/png' });

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    const thumbs = await screen.findAllByTestId('admin-media-thumb');
    expect(thumbs.length).toBeGreaterThanOrEqual(2);

    const initialOrder = thumbs.map((el) => el.getAttribute('data-media-id'));

    fireEvent.dragStart(thumbs[0]);
    fireEvent.dragOver(thumbs[1]);
    fireEvent.drop(thumbs[1]);

    await waitFor(() => {
      const reorderedThumbs = screen.getAllByTestId('admin-media-thumb');
      const newOrder = reorderedThumbs.map((el) => el.getAttribute('data-media-id'));
      expect(newOrder[0]).toBe(initialOrder[1]);
      expect(newOrder[1]).toBe(initialOrder[0]);
    });
  });
});
