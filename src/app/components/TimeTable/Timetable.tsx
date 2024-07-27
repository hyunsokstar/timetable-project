import React, { useState, ChangeEvent } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent, EventActions, EventRendererProps } from "@aldabil/react-scheduler/types";
import CustomTimeTableHeader from './CustomTimeTableHeader';
import CustomTimeTableLeftColumns from './CustomTimeTableLeftColumns';
import CustomSubjectRenderer from './CustomSubjectRenderer';

interface CustomEvent extends ProcessedEvent {
    teacher?: string;
    color: string;
    contentId?: number;
}

const Timetable: React.FC = () => {
    // 현재 날짜를 기준으로 이번 주의 월요일을 찾습니다.
    const getThisMonday = () => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 일요일이면 전 주 월요일로
        return new Date(today.setDate(diff));
    };

    const monday = getThisMonday();

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
        const selectedDate = new Date(scheduler.state.start.value);

        const initStartDate = event ? new Date(event.start) : selectedDate;
        const initEndDate = event ? new Date(event.end) : new Date(selectedDate.getTime() + 60 * 60 * 1000);

        const [title, setTitle] = useState(event?.title || "");
        const [teacher, setTeacher] = useState(event?.teacher || "");
        const [color, setColor] = useState(event?.color || "#3174ad");
        const [startTime, setStartTime] = useState(initStartDate.toTimeString().slice(0, 5));
        const [endTime, setEndTime] = useState(initEndDate.toTimeString().slice(0, 5));

        const submit = () => {
            const start = new Date(selectedDate);
            const end = new Date(selectedDate);

            const [startHours, startMinutes] = startTime.split(':').map(Number);
            const [endHours, endMinutes] = endTime.split(':').map(Number);

            start.setHours(startHours, startMinutes);
            end.setHours(endHours, endMinutes);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                alert("유효한 시간을 입력해주세요.");
                return;
            }

            const newEvent: CustomEvent = {
                event_id: event?.event_id || Math.random(),
                contentId: event?.contentId || Date.now(),
                title,
                teacher,
                color,
                start,
                end,
            };

            console.log("Submitting event:", newEvent);
            scheduler.onConfirm(newEvent, event ? "edit" : "create");
            scheduler.close();
        };

        return (
            <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>과목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>선생님</label>
                    <input
                        type="text"
                        value={teacher}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTeacher(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>색상</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>시작 시간</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>종료 시간</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button onClick={submit} style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {event ? "수정" : "생성"}
                </button>
            </div>
        );
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

    return (
        <div style={{ height: '100vh', width: "100%", padding: '20px' }}>
            <Scheduler
                events={events}
                view="week"
                week={{
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    weekStartOn: 0,
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
                selectedDate={monday} // 이번 주 월요일로 초기 날짜 설정
            />
        </div>
    );
};

export default Timetable;