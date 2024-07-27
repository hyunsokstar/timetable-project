import React from 'react';

interface CustomTimeTableLeftColumnsProps {
    hour: string;
}

const CustomTimeTableLeftColumns: React.FC<CustomTimeTableLeftColumnsProps> = ({ hour }) => {
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

export default CustomTimeTableLeftColumns;