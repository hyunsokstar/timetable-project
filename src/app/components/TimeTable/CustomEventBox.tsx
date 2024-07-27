import React, { useState } from 'react';
import { EventRendererProps, ProcessedEvent } from "@aldabil/react-scheduler/types";
import { FaTimes } from 'react-icons/fa';

interface CustomEvent extends ProcessedEvent {
    teacher?: string;
    color: string;
    contentId?: number;
}

interface CustomEventProps extends EventRendererProps {
    handleDeleteEvent: (eventId: string | number) => void;
}

const CustomEventBox: React.FC<CustomEventProps> = ({ event, handleDeleteEvent, ...rest }) => {
    const [isHovered, setIsHovered] = useState(false);
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                cursor: 'pointer',
                zIndex: 10,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.2s ease-in-out',
            }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(customEvent.event_id);
                }}
            >
                <FaTimes />
            </div>

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

export default CustomEventBox;