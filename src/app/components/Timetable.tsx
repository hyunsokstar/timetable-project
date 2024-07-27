
"use client";

import React from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import type { SchedulerHelpers, ProcessedEvent } from "@aldabil/react-scheduler/types";

const Timetable: React.FC = () => {
    const events: ProcessedEvent[] = [
        {
            event_id: 1,
            title: "수학",
            start: new Date("2024-07-27T09:00:00"),
            end: new Date("2024-07-27T10:00:00"),
        },
        // 다른 수업들을 여기에 추가
    ];

    const handleConfirm = async (
        event: ProcessedEvent,
        action: "create" | "edit",
        helpers: SchedulerHelpers
    ) => {
        if (action === "edit") {
            // 이벤트 수정 로직
            console.log("수정된 이벤트:", event);
        } else {
            // 새 이벤트 생성 로직
            console.log("새 이벤트:", event);
        }
        helpers.close();
        return event;
    };

    return (
        <Scheduler
            events={events}
            view="week"
            week={{
                weekDays: [0, 1, 2, 3, 4, 5],
                weekStartOn: 1,
                startHour: 9,
                endHour: 18,
                step: 60,
            }}
            onConfirm={handleConfirm}
            draggable={true}
        />
    );
};

export default Timetable;