import React, { useState, ChangeEvent } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent, EventActions, EventRendererProps } from "@aldabil/react-scheduler/types";

interface CustomEvent extends ProcessedEvent {
    teacher?: string;
    color: string;
}

const Timetable: React.FC = () => {
    const [events, setEvents] = useState<CustomEvent[]>([
        {
            event_id: 1,
            contentId: 1,
            title: "수학",
            teacher: "김선생",
            start: new Date("2024-07-21T09:00:00"),
            end: new Date("2024-07-21T10:00:00"),
            color: "#FF5733",
        },
        {
            event_id: 2,
            contentId: 2,
            title: "영어",
            teacher: "이선생",
            start: new Date("2024-07-21T10:00:00"),
            end: new Date("2024-07-21T11:00:00"),
            color: "#33FF57",
        },
        {
            event_id: 3,
            contentId: 3,
            title: "과학",
            teacher: "박선생",
            start: new Date("2024-07-21T11:00:00"),
            end: new Date("2024-07-21T12:00:00"),
            color: "#3357FF",
        },
    ]);

    const customDayScaleHeader = (day: Date) => {
        const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
        const dayIndex = day.getDay();

        return (
            <div style={{ textAlign: 'center', fontWeight: 'bold', padding: '8px', backgroundColor: '#f0f0f0' }}>
                {dayNames[dayIndex]}
            </div>
        );
    };

    const customTimeScaleHeader = (hour: string) => {
        const hourNumber = parseInt(hour, 10);
        const period = hourNumber - 8;

        if (period >= 1 && period <= 7) {
            return (
                <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                }}>
                    {period}교시
                </div>
            );
        }
        return <div></div>;
    };

    const customEventRenderer = (props: EventRendererProps) => {
        const { event, ...rest } = props;
        const customEvent = event as CustomEvent;
        const startHour = event.start.getHours();
        const endHour = event.end.getHours();
        const duration = endHour - startHour;

        return (
            <div
                {...rest}
                style={{
                    backgroundColor: customEvent.color,
                    color: 'white',
                    padding: '4px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `0 0 0 1px ${customEvent.color}`,
                }}
            >
                <div style={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}>
                    {duration}시간
                </div>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                    {customEvent.teacher && (
                        <div style={{ fontSize: '0.75rem' }}>교사: {customEvent.teacher}</div>
                    )}
                </div>
                {Array.from({ length: duration }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: `${(index + 1) * (100 / duration)}%`,
                            borderBottom: '1px dashed rgba(255, 255, 255, 0.3)',
                        }}
                    />
                ))}
            </div>
        );
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
                title,
                teacher,
                color,
                start,
                end,
            };

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
        console.log(`Event ${updatedEvent} ?? `, updatedEvent);
        return updatedEvent;
    };

    const handleConfirm = async (
        event: CustomEvent,
        action: EventActions
    ): Promise<CustomEvent> => {
        if (action === "create") {
            const newEvent = { ...event, event_id: Date.now() };
            setEvents(prevEvents => [...prevEvents, newEvent]);
            console.log(`New event created with id ${newEvent.event_id}`);
            return newEvent;
        } else if (action === "edit") {
            setEvents(prevEvents =>
                prevEvents.map(e => e.event_id === event.event_id ? event : e)
            );
            console.log(`Event ${event.event_id} updated successfully`);
            return event;
        }
        throw new Error("Invalid action");
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
                    headRenderer: customDayScaleHeader,
                    hourRenderer: customTimeScaleHeader
                }}
                onConfirm={handleConfirm}
                onEventDrop={handleEventDrop}
                draggable={true}
                editable={true}
                height={600}
                navigation={false}
                disableViewNavigator={true}
                hourFormat="24"
                eventRenderer={customEventRenderer}
                customEditor={customEditor}
            />
        </div>
    );
};

export default Timetable;