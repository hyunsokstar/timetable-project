import React from 'react';

const CustomTimeTableHeader = (day: Date) => {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayIndex = day.getDay();

    return (
        <div style={{ textAlign: 'center', fontWeight: 'bold', padding: '8px', backgroundColor: '#f0f0f0' }}>
            {dayNames[dayIndex]}
        </div>
    );
};

export default CustomTimeTableHeader;