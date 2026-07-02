import { momentLocalizer } from 'react-big-calendar'
import { Calendar as UICalendar } from 'react-big-calendar';
import moment from 'moment'
import { useEffect, useState } from 'react';

const localizer = momentLocalizer(moment)

interface RawEvent {
    ID: number;
    TITLE: string;
    DATE_START: string;
    DATE_END: string;
}

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
}
export const Calendar = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

    const getEventsForSelectedDate = (allEvents: CalendarEvent[], date: Date) => {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        return allEvents.filter((event) => {
            return event.start < endOfDay && event.end > startOfDay;
        });
    };

    useEffect(() => {
        if (selectedDate) {
            const eventsForDay = getEventsForSelectedDate(events, selectedDate);
            setFilteredEvents(eventsForDay);
        } else {
            setFilteredEvents([]);
        }
    }, [selectedDate, events]);

    const handleSelectSlot = (slotInfo: any) => {
        setSelectedDate(slotInfo.start);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/calendar/list', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const { data } = await res.json();

            const convertedEvents = data?.map((event: RawEvent) => ({
                id: event.ID,
                title: event.TITLE,
                start: new Date(event.DATE_START),
                end: new Date(event.DATE_END),
            }));

            setEvents(convertedEvents);
        };
        fetchData();
    }, []);

    return (
        <div>
            <UICalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectSlot={handleSelectSlot}
                selectable={true}
            />
            {selectedDate && (
                <div style={{ padding: '10px', background: '#e0f7fa', marginBottom: '10px' }}>
                    <h3>События на {selectedDate.toLocaleDateString()}:</h3>
                    <ul>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <li key={event.id}>
                                    <strong>{event.title}</strong><br />
                                    {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </li>
                            ))
                        ) : (
                            <li>Событий на этот день нет.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}