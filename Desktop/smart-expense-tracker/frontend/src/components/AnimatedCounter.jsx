import { useSpring, animated } from '@react-spring/web';

const AnimatedCounter = ({ value, format = (v) => v }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 120, friction: 14 },
  });
  return <animated.span>{number.to((n) => format(n))}</animated.span>;
};

export default AnimatedCounter;
