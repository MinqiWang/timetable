export const decorate = (elements) => {
    elements.map(element => {
        element.style.width = "95%";
        element.style.boxShadow = "2px 2px 2px 2px #00000055";
        element.style.zIndex = "1";
    })
}

export const undecorate = (elements) => {
    elements.map(element=>{
        element.style.width = "90%";
        element.style.boxShadow = "";
        element.style.zIndex = "0";
    })
}

export const opacity05 = (elements) => {
    elements.map(element=>{
        element.style.opacity = 0.5;
    })
}

export const opacity10 = (elements) => {
    elements.map(element=>{
        element.style.opacity = 1;
    })
}

export const getEventColor = (event_id) => {
    return EventColors[event_id % EventColors.length];
}

const EventColors = ["#85DCB", "#C38D9E", "#41B3A3", "#8D8741", "#659DBD", "#BC986A", "#379683", "#3500D3", "#4056A1", "#116466", "#2E151B"];