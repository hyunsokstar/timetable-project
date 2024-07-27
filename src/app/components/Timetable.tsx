"use client";

import React, { useState } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent, EventActions, EventRendererProps } from "@aldabil/react-scheduler/types";

const Timetable: React.FC = () => {
    const [events, setEvents] = useState<ProcessedEvent[]>([
        {
            event_id: 1,
            title: "수학",
            start: new Date("2024-07-21T09:00:00"),
            end: new Date("2024-07-21T10:00:00"),
        },
        // 다른 수업들을 여기에 추가
    ]);

    const customDayScaleHeader = (day: Date) => {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayIndex = day.getDay();

        return (
            <div style={{ textAlign: 'center', fontWeight: 'bold', padding: '8px', backgroundColor: '#f0f0f0' }}>
                {dayNames[dayIndex]}
            </div>
        );
    };

    const customTimeScaleHeader = (hour: string) => {
        const [hourStr, meridiem] = hour.split(' ');
        let hourNumber = parseInt(hourStr, 10);

        if (meridiem === 'PM' && hourNumber !== 12) {
            hourNumber += 12;
        }
        if (meridiem === 'AM' && hourNumber === 12) {
            hourNumber = 0;
        }

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
        return (
            <div
                {...rest}
                style={{
                    background: '#3174ad',
                    color: 'white',
                    padding: '4px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {event.title}
            </div>
        );
    };

    const handleConfirm = async (
        event: ProcessedEvent,
        action: EventActions
    ): Promise<ProcessedEvent> => {
        if (action === "edit") {
            setEvents(prevEvents =>
                prevEvents.map(e => e.event_id === event.event_id ? event : e)
            );
        } else if (action === "create") {
            setEvents(prevEvents => [...prevEvents, { ...event, event_id: Date.now() }]);
        }
        return event;
    };

    const handleEventDrop = async (
        event: React.DragEvent<HTMLButtonElement>,
        droppedOn: Date,
        updatedEvent: ProcessedEvent,
        originalEvent: ProcessedEvent
    ): Promise<ProcessedEvent | void> => {
        setEvents(prevEvents =>
            prevEvents.map(e => e.event_id === updatedEvent.event_id ? updatedEvent : e)
        );
        return updatedEvent;
    };

    return (
        <div style={{ height: '100vh', width: "100%", padding: '20px' }}>
            <Scheduler
                events={events}
                view="week"
                week={{
                    weekDays: [0, 1, 2, 3, 4, 5],
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
                hourFormat="12"
                eventRenderer={customEventRenderer}
            />
        </div>
    );
};

export default Timetable;