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