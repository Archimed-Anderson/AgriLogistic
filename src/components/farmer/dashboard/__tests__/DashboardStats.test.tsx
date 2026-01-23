/**
 * Unit Tests for DashboardStats Component
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '@/components/farmer/dashboard/DashboardStats';
import type { DashboardKPIs } from '@/types/farmer/dashboard';

describe('DashboardStats', () => {
  const mockKPIs: DashboardKPIs = {
    totalRevenue: 245890,
    monthlyRevenue: 45890,
    revenueGrowth: 12.5,
    activeOrders: 23,
    pendingOrders: 8,
    completedOrders: 156,
    equipmentRented: 5,
    rentalRevenue: 12450,
    marketplaceRevenue: 28340,
    servicesRevenue: 5100,
    totalCrops: 12,
    activeCrops: 8,
    harvestReady: 3,
  };

  it('renders without crashing', () => {
    render(<DashboardStats kpis={mockKPIs} />);
    expect(screen.getByText('Revenus du mois')).toBeInTheDocument();
  });

  it('displays correct revenue value', () => {
    render(<DashboardStats kpis={mockKPIs} />);
    expect(screen.getByText('45.9K')).toBeInTheDocument();
  });

  it('shows revenue growth percentage', () => {
    render(<DashboardStats kpis={mockKPIs} />);
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('displays active orders count', () => {
    render(<DashboardStats kpis={mockKPIs} />);
    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    const { container } = render(<DashboardStats kpis={mockKPIs} isLoading={true} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('displays all 4 stat cards', () => {
    render(<DashboardStats kpis={mockKPIs} />);
    expect(screen.getByText('Revenus du mois')).toBeInTheDocument();
    expect(screen.getByText('Commandes actives')).toBeInTheDocument();
    expect(screen.getByText('Matériel loué')).toBeInTheDocument();
    expect(screen.getByText('Cultures actives')).toBeInTheDocument();
  });

  it('shows positive trend icon for positive growth', () => {
    const { container } = render(<DashboardStats kpis={mockKPIs} />);
    const trendingUpIcons = container.querySelectorAll('[class*="lucide-trending-up"]');
    expect(trendingUpIcons.length).toBeGreaterThan(0);
  });

  it('displays equipment count correctly', () => {
    render(<DashboardStats kpis={mockKPIs} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows active crops out of total', () => {
    render(<DashboardStats kpis={mockKPIs} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('sur 12')).toBeInTheDocument();
  });
});
