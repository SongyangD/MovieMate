import {useState, useEffect, useCallback, useRef} from "react";
const ImageSliders = ({slides, parentWidth}) => {

    const timerRef = useRef(null);
    
    const[currentIndex, setCurrentIndex] = useState(0);

    const sliderStyles = {
        height: "100%",
        position: "center",
    };

    const slideStyles={
        width: "100%",
        height: "100%",
        borderRadius: "0px",
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

    const goToNext = useCallback( () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);}, [currentIndex, slides])

    const dotsContainerStyles ={
        display: "flex",
        justifyContent: "center",

    };

    const slidesContainerStyles={
        display: 'flex',
        height:'100%',
        transition: "transform ease-out 0.3s",
    }

    const dotStyles = {
        margin: "0 3px",
        cursor: "pointer",
        fontSize: "20px",
    };

    const slidesContainerOverflowStyles = {
        overflow: "hidden",
        height: "100%",
      };

    const goToSlide = (slideIndex) =>{
        setCurrentIndex(slideIndex)
    };

    const getSlideStylesWithBackground = (slideIndex) => ({
        ...slideStyles,
        backgroundImage: `url(${slides[slideIndex].url})`,
        width: `${parentWidth}px`,
      });
      const getSlidesContainerStylesWithWidth = () => ({
        ...slidesContainerStyles,
        width: parentWidth * slides.length,
        transform: `translateX(${-(currentIndex * parentWidth)}px)`,
      });

    useEffect(()=> {
        console.log("use effect");
        timerRef.current = setTimeout(()=> {
            goToNext();
        }, 3000);
        return () => clearTimeout(timerRef.current);
    }, [goToNext]);
   

    //***************/
  

    return (
        <div style={sliderStyles}>

          <div>
            <div onClick={goToPrevious} style={leftArrowStyles}>
              
            </div>
            <div onClick={goToNext} style={rightArrowStyles}>
              
            </div>
          </div>
          <div style={slidesContainerOverflowStyles}>
            <div style={getSlidesContainerStylesWithWidth()}>
              {slides.map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  style={getSlideStylesWithBackground(slideIndex)}
                ></div>
              ))}
            </div>
          </div>
          <div style={dotsContainerStyles}>
            {slides.map((slide, slideIndex) => (
              <div
                style={dotStyles}
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
              >
                ●
              </div>
            ))}
          </div>
          {/* display: "inline-block", */}
          <div style={{textAlign: "center", marginTop: "20px",  backgroundColor: "#f0f5f1"}}>
                <p>{slides[currentIndex].title}</p>
                
            </div>
        </div>
      );
    };

export default ImageSliders;