/**
 * Availability Calendar Component
 * Visual calendar showing equipment availability
 */
'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Equipment, Rental } from '@/types/farmer/rental';

interface AvailabilityCalendarProps {
  equipment: Equipment[];
  rentals: Rental[];
  isLoading?: boolean;
}

export function AvailabilityCalendar({ equipment, rentals, isLoading }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    equipment && equipment.length > 0 ? equipment[0].id : null
  );

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateRented = (day: number) => {
    if (!selectedEquipment) return false;
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return rentals.some(rental => {
      if (rental.equipmentId !== selectedEquipment) return false;
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      return date >= start && date <= end;
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Calendrier de Disponibilité</h2>
        </div>
      </div>

      {/* Equipment Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un équipement
        </label>
        <select
          value={selectedEquipment || ''}
          onChange={(e) => setSelectedEquipment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {equipment.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.name} - {eq.status}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 capitalize">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isRented = isDateRented(day);
          const isToday = 
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isRented
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              } ${isToday ? 'ring-2 ring-green-600' : ''}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded" />
          <span className="text-gray-600">Loué</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-green-600 rounded" />
          <span className="text-gray-600">Aujourd'hui</span>
        </div>
      </div>

      {/* Upcoming Rentals */}
      {selectedEquipment && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Locations à venir</h4>
          <div className="space-y-2">
            {rentals
              .filter(r => r.equipmentId === selectedEquipment && new Date(r.endDate) >= new Date())
              .slice(0, 3)
              .map((rental) => (
                <div key={rental.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{rental.renter.name}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(rental.startDate).toLocaleDateString('fr-FR')} - {new Date(rental.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">
                    {(rental.pricing.total / 1000).toFixed(0)}K XOF
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
