import React, { useState } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent, EventActions, EventRendererProps } from "@aldabil/react-scheduler/types";
import CustomTimeTableHeader from './CustomTimeTableHeader';
import CustomTimeTableLeftColumns from './CustomTimeTableLeftColumns';
import CustomSubjectRenderer from './CustomSubjectRenderer';
import TimeTableCustomEditor from './TimeTableCustomEditor';

interface CustomEvent extends ProcessedEvent {
    teacher?: string;
    color: string;
    contentId?: number;
}

const Timetable: React.FC = () => {
    // 현재 날짜를 기준으로 이번 주의 월요일을 찾습니다.
    const getThisMonday = () => {
        const today = new Date();

        console.log("today", today);

        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 일요일이면 같은 주의 월요일로
        return new Date(today.setDate(diff));
    };

    const monday = getThisMonday();
    console.log("monday", monday);

    const [events, setEvents] = useState<CustomEvent[]>([
        {
            event_id: 1,
            contentId: 1,
            title: "수학",
            teacher: "김선생",
            start: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 9, 0),
            end: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 10, 0),
            color: "#FF5733",
        },
        {
            event_id: 2,
            contentId: 2,
            title: "영어",
            teacher: "이선생",
            start: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 10, 0),
            end: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 11, 0),
            color: "#33FF57",
        },
        {
            event_id: 3,
            contentId: 3,
            title: "과학",
            teacher: "박선생",
            start: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 11, 0),
            end: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 12, 0),
            color: "#3357FF",
        },
    ]);

    const handleDeleteEvent = (eventId: string | number) => {
        setEvents(prevEvents => prevEvents.filter(e => e.event_id !== eventId));
    };

    const customEditor = (scheduler: any) => {
        const event = scheduler.edited as CustomEvent;
        return <TimeTableCustomEditor scheduler={scheduler} event={event} />;
    };

    const handleEventDrop = async (
        event: React.DragEvent<HTMLButtonElement>,
        droppedOn: Date,
        updatedEvent: CustomEvent,
        originalEvent: CustomEvent
    ): Promise<CustomEvent | void> => {
        setEvents(prevEvents =>
            prevEvents.map(e => e.event_id === updatedEvent.event_id ? updatedEvent : e)
        );
        console.log(`Event ${updatedEvent.event_id} moved successfully`);
        console.log(`Updated Event:`, updatedEvent);
        return updatedEvent;
    };

    const handleConfirm = async (
        event: CustomEvent,
        action: EventActions
    ): Promise<CustomEvent> => {
        console.log(`Handling ${action} action for event:`, event);

        if (action === "create") {
            const newEvent = { ...event, event_id: Date.now(), contentId: Date.now() };
            setEvents(prevEvents => [...prevEvents, newEvent]);
            console.log(`New event created:`, newEvent);
            return newEvent;
        } else if (action === "edit") {
            setEvents(prevEvents =>
                prevEvents.map(e => e.event_id === event.event_id ? event : e)
            );
            console.log(`Event updated:`, event);
            return event;
        } else if (action === "delete") {
            setEvents(prevEvents => prevEvents.filter(e => e.event_id !== event.event_id));
            console.log(`Event deleted:`, event);
            return event;
        }
        throw new Error(`Invalid action: ${action}`);
    };

    // 추가된 디버깅 코드
    console.log("Event dates:", events.map(e => e.start));

    return (
        <div style={{ height: '100vh', width: "100%", padding: '20px' }}>
            <Scheduler
                events={events}
                view="week"
                week={{
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    weekStartOn: 1, // 변경됨: 0에서 1로 (월요일로 설정)
                    startHour: 9,
                    endHour: 16,
                    step: 60,
                    headRenderer: CustomTimeTableHeader,
                    hourRenderer: CustomTimeTableLeftColumns
                }}
                onConfirm={handleConfirm}
                onEventDrop={handleEventDrop}
                draggable={true}
                editable={true}
                height={600}
                navigation={false}
                disableViewNavigator={true}
                hourFormat="24"
                eventRenderer={(props: EventRendererProps) => (
                    <CustomSubjectRenderer {...props} handleDeleteEvent={handleDeleteEvent} />
                )}
                customEditor={customEditor}
                selectedDate={monday}
            />
        </div>
    );
};

export default Timetable;