import React from 'react';
import { EventRendererProps } from "@aldabil/react-scheduler/types";
import CustomEventBox from './CustomEventBox';

interface CustomSubjectRendererProps extends EventRendererProps {
    handleDeleteEvent: (eventId: string | number) => void;
}

const CustomSubjectRenderer: React.FC<CustomSubjectRendererProps> = (props) => {
    return (
        <CustomEventBox
            {...props}
            handleDeleteEvent={props.handleDeleteEvent}
        />
    );
};

export default CustomSubjectRenderer;