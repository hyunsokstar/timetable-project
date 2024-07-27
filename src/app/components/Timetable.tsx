import React, { useState } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent, EventActions, EventRendererProps } from "@aldabil/react-scheduler/types";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// ProcessedEvent 타입을 확장하여 teacher 필드 추가
interface CustomEvent extends ProcessedEvent {
    teacher?: string;
}

const Timetable: React.FC = () => {
    const [events, setEvents] = useState<CustomEvent[]>([
        {
            event_id: 1,
            title: "수학",
            teacher: "김선생",
            start: new Date("2024-07-21T09:00:00"),
            end: new Date("2024-07-21T10:00:00"),
        },
        // 다른 수업들을 여기에 추가
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
                    backgroundColor: 'rgba(49, 116, 173, 0.5)',
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
                    boxShadow: '0 0 0 1px rgba(49, 116, 173, 0.5)',
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

    const customEditor = (scheduler: any) => {
        const event = scheduler.edited;
        const [title, setTitle] = useState(event?.title || "");
        const [teacher, setTeacher] = useState(event?.teacher || "");

        const handleSubmit = () => {
            scheduler.onConfirm({
                ...event,
                title,
                teacher,
                event_id: event?.event_id || Math.random(),
            }, event ? "edit" : "create");
            scheduler.close();
        };

        return (
            <Dialog open={true} onClose={() => scheduler.close()}>
                <DialogTitle>{event ? "수업 수정" : "새 수업 추가"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="수업명"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="교사"
                        type="text"
                        fullWidth
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                    />

                    날짜 수정 컴퍼넌트 추가 필요

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => scheduler.close()}>취소</Button>
                    <Button onClick={handleSubmit}>확인</Button>
                </DialogActions>
            </Dialog>
        );
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