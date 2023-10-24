import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import slider from '../assets/img/carousel/slider1.jpg'

const Header = () => {
  return (
    <Carousel showStatus={false} showThumbs={false}>
      <div>
        <img src={slider} />
      </div>
      <div>
        <img src={slider} />
      </div>
      <div>
        <img src={slider} />
      </div>
    </Carousel>
  )
}

export default Header