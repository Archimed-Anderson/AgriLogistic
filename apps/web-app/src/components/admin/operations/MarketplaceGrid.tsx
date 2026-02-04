'use client';

import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { cn } from '@/lib/utils';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import type { MarketOffer } from '@/store/marketplaceStore';

interface MarketplaceGridProps {
  offers: MarketOffer[];
  onRowClicked: (offer: MarketOffer) => void;
}

const columnDefs = [
  { field: 'id', headerName: 'Offer ID', width: 120, cellClass: 'font-mono text-xs' },
  {
    field: 'title',
    headerName: 'Product',
    flex: 1,
    cellClass: 'font-black uppercase tracking-tight',
  },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'farmerName', headerName: 'Farmer', width: 150 },
  {
    field: 'price',
    headerName: 'Price',
    width: 120,
    valueGetter: (p: any) => `${p.data.price} ${p.data.unit}`,
    cellClass: 'font-mono font-black italic text-emerald-500',
  },
  {
    field: 'aiScore',
    headerName: 'AI Trust',
    width: 110,
    cellRenderer: (p: any) => (
      <div className="flex items-center gap-2 h-full">
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500" style={{ width: `${p.data.aiScore * 100}%` }} />
        </div>
        <span className="text-[9px] font-black">{Math.round(p.data.aiScore * 100)}%</span>
      </div>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    cellRenderer: (p: any) => (
      <span
        className={cn(
          'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border',
          p.data.status === 'active'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            : p.data.status === 'pending'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
              : 'bg-red-500/10 border-red-500/20 text-red-500'
        )}
      >
        {p.data.status}
      </span>
    ),
  },
];

export function MarketplaceGrid({ offers, onRowClicked }: MarketplaceGridProps) {
  const gridRef = useRef<AgGridReactType>(null);

  return (
    <div className="flex-1 ag-theme-alpine-dark custom-ag-grid">
      <style>{`
        .custom-ag-grid { --ag-background-color: transparent; --ag-odd-row-background-color: rgba(255,255,255,0.02); --ag-header-background-color: transparent; --ag-border-color: rgba(255,255,255,0.05); --ag-font-family: inherit; }
        .ag-header-cell-label { text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #64748b; }
        .ag-row { border-bottom: 1px solid rgba(255,255,255,0.03); }
        .ag-cell { display: flex; align-items: center; border: none !important; }
      `}</style>
      <AgGridReact
        ref={gridRef}
        rowData={offers}
        columnDefs={columnDefs}
        onRowClicked={(e) => e.data && onRowClicked(e.data)}
        rowSelection="single"
        animateRows={true}
      />
    </div>
  );
}
