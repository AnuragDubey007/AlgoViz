export function getDelay(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
};

export function getCurrentSpeed(){
    const slider = document.getElementById('speed');
    const sliderValue = parseInt(slider.value);
    return 301- sliderValue * 3;
}