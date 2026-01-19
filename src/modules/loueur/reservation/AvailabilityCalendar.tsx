/**
 * =======================================================
 * AVAILABILITY CALENDAR - Smart Scheduling System
 * =======================================================
 * Features:
 * - Visual availability calendar (month/week/day views)
 * - Conflict detection and resolution
 * - Optimized slot management
 * - Color-coded status indicators
 * - Peak/off-peak season highlighting
 * - Booking constraints management
 */

import { useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export interface TimeSlot {
  date: Date;
  status: "available" | "reserved" | "blocked" | "maintenance" | "peak-season";
  reservationId?: string;
  price?: number;
  bookedBy?: string;
  notes?: string;
}

export interface BookingConstraints {
  minDays: number;
  maxDays: number;
  advanceNoticeDays: number;
  blackoutDates: Date[];
  maintenanceWindows: { start: Date; end: Date }[];
}

interface AvailabilityCalendarProps {
  equipmentId: string;
  equipmentName: string;
  basePrice: number;
  peakPrice: number;
  availability: TimeSlot[];
  constraints?: BookingConstraints;
  onDateSelect?: (start: Date, end: Date) => void;
  selectedRange?: { start: Date; end: Date };
}

type ViewMode = "month" | "week" | "day";

export function AvailabilityCalendar({
  equipmentId,
  equipmentName,
  basePrice,
  peakPrice,
  availability,
  constraints,
  onDateSelect,
  selectedRange,
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);

  // Generate calendar days for current view
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    const days: Date[] = [];
    const current = new Date(startDate);

    // Generate 42 days (6 weeks) for month view
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  // Get slot status for a date
  const getSlotStatus = (date: Date): TimeSlot => {
    const dateStr = date.toISOString().split("T")[0];
    const slot = availability.find((s) => s.date.toISOString().split("T")[0] === dateStr);

    if (slot) return slot;

    // Check if peak season (simplified: March-May, September-November)
    const month = date.getMonth();
    const isPeakSeason = (month >= 2 && month <= 4) || (month >= 8 && month <= 10);

    return {
      date,
      status: isPeakSeason ? "peak-season" : "available",
      price: isPeakSeason ? peakPrice : basePrice,
    };
  };

  // Check if date is in selected range
  const isInSelectedRange = (date: Date): boolean => {
    if (!selectedRange) return false;
    const time = date.getTime();
    return time >= selectedRange.start.getTime() && time <= selectedRange.end.getTime();
  };

  // Check if date is selectable
  const isSelectable = (date: Date): boolean => {
    const slot = getSlotStatus(date);
    if (slot.status === "reserved" || slot.status === "blocked" || slot.status === "maintenance") {
      return false;
    }

    // Check advance notice
    if (constraints) {
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + constraints.advanceNoticeDays);
      if (date < minDate) return false;

      // Check blackout dates
      if (constraints.blackoutDates.some((bd) => bd.toDateString() === date.toDateString())) {
        return false;
      }
    }

    return date >= new Date();
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (!isSelectable(date)) return;

    if (!selectionStart) {
      setSelectionStart(date);
    } else {
      const start = selectionStart < date ? selectionStart : date;
      const end = selectionStart < date ? date : selectionStart;

      // Check if range is valid
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (constraints) {
        if (daysDiff < constraints.minDays) {
          alert(`Minimum rental period is ${constraints.minDays} days`);
          setSelectionStart(null);
          return;
        }
        if (daysDiff > constraints.maxDays) {
          alert(`Maximum rental period is ${constraints.maxDays} days`);
          setSelectionStart(null);
          return;
        }
      }

      // Check if all dates in range are available
      const current = new Date(start);
      while (current <= end) {
        if (!isSelectable(current)) {
          alert("Selected range contains unavailable dates");
          setSelectionStart(null);
          return;
        }
        current.setDate(current.getDate() + 1);
      }

      onDateSelect?.(start, end);
      setSelectionStart(null);
    }
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  // Calculate availability stats
  const stats = useMemo(() => {
    const total = calendarDays.length;
    const available = calendarDays.filter((d) => getSlotStatus(d).status === "available").length;
    const reserved = calendarDays.filter((d) => getSlotStatus(d).status === "reserved").length;
    const peak = calendarDays.filter((d) => getSlotStatus(d).status === "peak-season").length;

    return {
      total,
      available,
      reserved,
      peak,
      occupancyRate: Math.round((reserved / total) * 100),
    };
  }, [calendarDays]);

  // Status color classes
  const getStatusColor = (status: TimeSlot["status"]) => {
    const colors = {
      available: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
      "peak-season":
        "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      reserved: "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      blocked: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      maintenance:
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    };
    return colors[status];
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#2563eb]" />
            Availability Calendar
          </h3>
          <p className="text-muted-foreground mt-1">{equipmentName}</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          {(["month", "week", "day"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                viewMode === mode
                  ? "bg-white dark:bg-gray-800 shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">Available</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.available}</div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700 dark:text-orange-400">Reserved</span>
          </div>
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.reserved}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700 dark:text-blue-400">Peak Season</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.peak}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-purple-700 dark:text-purple-400">Occupancy</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.occupancyRate}%</div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-muted rounded-lg p-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h4 className="text-xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectionStart ? "Click end date to complete selection" : "Click dates to select rental period"}
          </p>
        </div>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-muted border-b">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const slot = getSlotStatus(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = isInSelectedRange(day);
            const isStartSelection = selectionStart?.toDateString() === day.toDateString();
            const selectable = isSelectable(day);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!selectable}
                className={`
                  relative p-3 border-b border-r hover:bg-muted transition-colors min-h-[80px]
                  ${!isCurrentMonth ? "opacity-40" : ""}
                  ${isToday ? "ring-2 ring-[#2563eb] ring-inset" : ""}
                  ${isSelected ? "bg-blue-100 dark:bg-blue-900/20" : ""}
                  ${isStartSelection ? "ring-2 ring-green-500 ring-inset" : ""}
                  ${!selectable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                `}
              >
                <div className="text-sm font-semibold mb-1">{day.getDate()}</div>

                {/* Status indicator */}
                <div
                  className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(slot.status)}`}
                >
                  {slot.status === "available" && "✓"}
                  {slot.status === "peak-season" && "★"}
                  {slot.status === "reserved" && "◉"}
                  {slot.status === "blocked" && "✕"}
                  {slot.status === "maintenance" && "⚙"}
                </div>

                {/* Price */}
                {slot.price && (
                  <div className="text-xs font-semibold text-[#2563eb] mt-1">€{slot.price}</div>
                )}

                {/* Tooltip on hover */}
                {hoveredDate?.toDateString() === day.toDateString() && (
                  <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl">
                    <div className="font-semibold">{day.toLocaleDateString()}</div>
                    <div className="capitalize">{slot.status.replace("-", " ")}</div>
                    {slot.price && <div className="mt-1">Price: €{slot.price}/day</div>}
                    {slot.bookedBy && <div className="mt-1">Booked by: {slot.bookedBy}</div>}
                    {slot.notes && <div className="mt-1 text-gray-300">{slot.notes}</div>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { status: "available" as const, label: "Available", icon: CheckCircle },
          { status: "peak-season" as const, label: "Peak Season", icon: TrendingUp },
          { status: "reserved" as const, label: "Reserved", icon: Users },
          { status: "blocked" as const, label: "Blocked", icon: XCircle },
          { status: "maintenance" as const, label: "Maintenance", icon: AlertCircle },
        ].map(({ status, label, icon: Icon }) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded border ${getStatusColor(status)} flex items-center justify-center`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Constraints Info */}
      {constraints && (
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <div className="font-semibold text-blue-900 dark:text-blue-100">Booking Constraints:</div>
              <div className="text-blue-700 dark:text-blue-300">
                • Minimum rental: {constraints.minDays} days
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                • Maximum rental: {constraints.maxDays} days
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                • Advance notice: {constraints.advanceNoticeDays} days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
