import React, { useState, ChangeEvent } from 'react';
import { ProcessedEvent } from "@aldabil/react-scheduler/types";

interface CustomEvent extends ProcessedEvent {
    teacher?: string;
    color: string;
    contentId?: number;
}

interface TimeTableCustomEditorProps {
    scheduler: any;
    event?: CustomEvent;
}

const TimeTableCustomEditor: React.FC<TimeTableCustomEditorProps> = ({ scheduler, event }) => {
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

export default TimeTableCustomEditor;