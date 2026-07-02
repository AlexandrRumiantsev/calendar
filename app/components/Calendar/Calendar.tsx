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

        return allEvents?.filter((event) => {
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

    const handleSaveEvent = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const objectData = Object.fromEntries(formData);
        const res = await fetch('/api/calendar/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objectData),
        });
        const result = await res.json();
        
        const convertedEvent = {
            id: result.data.ID,
            title: result.data.TITLE,
            start: new Date(result.data.DATE_START),
            end: new Date(result.data.DATE_END),
        };

        console.log()

        setEvents((prevEvents) => ([
            ...prevEvents,
            convertedEvent
        ]))
    }

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
                    <h3>Добавить событие в календарь</h3>
                    <form onSubmit={handleSaveEvent}>
                        <input type="text" placeholder='заголовок' name='TITLE'/>
                        <input type="text" placeholder='текст'  name='TEXT'/>
                        <input type="datetime-local" placeholder='Дата начала задачи'  name='DATE_START'/>
                        <input type="datetime-local" placeholder='Дата конеца задачи'  name='DATE_END'/>
                        <input type="submit" value='Сохранить' />
                    </form>
                </div>
            )}
        </div>
    )
}