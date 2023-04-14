import {useState} from "react";
const ImageSliders = ({slides}) => {
    const[currentIndex, setCurrentIndex] = useState(0);
    const sliderStyles = {
        height: "100%",
        position: "relative",
    };
    const slideStyles={
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundPosition: "center",
        backgroundPosition: "cover",
        backgroundImage: `url(${slides[currentIndex].url})`,
        backgroundSize:"cover",
    };

    const leftArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        left: "32px",
        fontSize: "45px",
        color: "#fff",
        zIndex:1,
        cursor: "pointer",
    };

    const rightArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        right: "32px",
        fontSize: "45px",
        color: "#fff",
        zIndex:1,
        cursor: "pointer",
    };

    const goToPrevious = () =>{
        const ifFirstSlide = currentIndex === 0;
        const newIndex = ifFirstSlide ? slides.length - 1: currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const dotsContainerStyles ={
        display: "flex",
        justifyContent: "center",

    };

    const dotStyles = {
        margin: "0 3px",
        cursor: "pointer",
        fontSize: "20px",
    };

    const goToSlide = (slideIndex) =>{
        setCurrentIndex(slideIndex)
    };
   

    return (
        <div style={sliderStyles}>
            <div style={leftArrowStyles} onClick={goToPrevious}>←</div>
            <div style={rightArrowStyles}onClick={goToNext}>→</div>
            <div 
                style = {slideStyles}></div>
            <div style={dotsContainerStyles}>
                {slides.map((slides, slideIndex)=>(
                    <div key={slideIndex} style={dotStyles} onClick={()=>goToSlide(slideIndex)}>●</div>
                ) )}
            </div>

        </div>
    )
};

export default ImageSliders;