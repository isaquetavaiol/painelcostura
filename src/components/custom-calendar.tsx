'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomCalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  deliveryDays?: Date[];
}

export default function CustomCalendar({ selected, onSelect, deliveryDays = [] }: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const prevMonthDays = useMemo(() => {
    const prevMonth = subMonths(currentDate, 1);
    const endOfPrevMonth = endOfMonth(prevMonth);
    const days = eachDayOfInterval({
      start: subMonths(endOfPrevMonth, startingDayIndex - 1),
      end: endOfPrevMonth,
    });
    return startingDayIndex > 0 ? days.slice(-startingDayIndex) : [];
  }, [currentDate, startingDayIndex]);


  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isDeliveryDay = (day: Date) => {
    return deliveryDays.some(deliveryDay => isSameDay(day, deliveryDay));
  };
  
  const allDays = [...prevMonthDays, ...daysInMonth];

  return (
    <div className="w-full max-w-md p-4 rounded-lg bg-card text-card-foreground">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map(day => (
          <div key={day} className="text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {allDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isDelivery = isDeliveryDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={index}
              onClick={() => onSelect(day)}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full transition-colors',
                !isCurrentMonth && 'text-muted-foreground/50',
                isCurrentMonth && 'hover:bg-accent',
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isDelivery && !isSelected && 'bg-accent text-accent-foreground',
                isToday && !isSelected && 'border-0'
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
