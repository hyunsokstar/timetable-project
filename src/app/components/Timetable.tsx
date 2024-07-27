"use client";

import React from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent, EventActions } from "@aldabil/react-scheduler/types";

const Timetable: React.FC = () => {
    const events: ProcessedEvent[] = [
        {
            event_id: 1,
            title: "수학",
            start: new Date("2024-07-21T09:00:00"),
            end: new Date("2024-07-21T10:00:00"),
        },
        // 다른 수업들을 여기에 추가
    ];

    const handleConfirm = async (
        event: ProcessedEvent,
        action: EventActions
    ): Promise<ProcessedEvent> => {
        console.log(action, "이벤트:", event);
        return event;
    };

    const customDayScaleHeader = (day: Date) => {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayIndex = day.getDay();

        return (
            <div style={{ textAlign: 'center', fontWeight: 'bold', padding: '8px', backgroundColor: '#f0f0f0' }}>
                {dayNames[dayIndex]}
            </div>
        );
    };

    return (
        <div style={{ height: '100vh', padding: '20px' }}>
            <Scheduler
                events={events}
                view="week"
                week={{
                    weekDays: [0, 1, 2, 3, 4, 5], // 일요일부터 금요일까지
                    weekStartOn: 0, // 일요일부터 시작
                    startHour: 9,
                    endHour: 19,
                    step: 60,
                    headRenderer: customDayScaleHeader
                }}
                onConfirm={handleConfirm}
                draggable={true}
                height={600}
                navigation={false}
                disableViewNavigator={true}
            />
        </div>
    );
};

export default Timetable;