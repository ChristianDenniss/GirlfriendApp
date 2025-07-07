import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, Animated, StyleSheet, Dimensions, ActivityIndicator, View, PanResponder } from 'react-native';
import { StatusBar } from 'expo-status-bar';
const isoMap = require('../../assets/images/pixelArt/isometric_map_320x400.png');

const sprites = {
  forward: require('../../assets/images/pixelArt/maddy/pixelMforward.png'),
  forwardStep1: require('../../assets/images/pixelArt/maddy/pixelMforwardStep1.png'),
  forwardStep2: require('../../assets/images/pixelArt/maddy/pixelMforwardStep2.png'),
  backward: require('../../assets/images/pixelArt/maddy/pixelMbackwards.png'),
  backwardStep1: require('../../assets/images/pixelArt/maddy/pixelMbackwardsStep1.png'),
  backwardStep2: require('../../assets/images/pixelArt/maddy/pixelMbackwardsStep2.png'),
  left: require('../../assets/images/pixelArt/maddy/pixelMleft.png'),
  leftStep1: require('../../assets/images/pixelArt/maddy/pixelMleftStep1.png'),
  leftStep2: require('../../assets/images/pixelArt/maddy/pixelMleftStep2.png'),
  right: require('../../assets/images/pixelArt/maddy/pixelMright.png'),
  rightStep1: require('../../assets/images/pixelArt/maddy/pixelMrightStep1.png'),
  rightStep2: require('../../assets/images/pixelArt/maddy/pixelMrightStep2.png'),
  leftBackward: require('../../assets/images/pixelArt/maddy/pixelMleftBackward.png'),
  leftBackwardStep1: require('../../assets/images/pixelArt/maddy/pixelMleftBackwardStep1.png'),
  leftBackwardStep2: require('../../assets/images/pixelArt/maddy/pixelMleftBackwardStep2.png'),
  rightBackward: require('../../assets/images/pixelArt/maddy/pixelMrightBackward.png'),
  rightBackwardStep1: require('../../assets/images/pixelArt/maddy/pixelMrightBackwardStep1.png'),
  rightBackwardStep2: require('../../assets/images/pixelArt/maddy/pixelMrightBackwardStep2.png'),
  sideRight: require('../../assets/images/pixelArt/maddy/pixelMsideRight.png'),
  sideRightStep1: require('../../assets/images/pixelArt/maddy/pixelMsideRightStep1.png'),
  sideRightStep2: require('../../assets/images/pixelArt/maddy/pixelMsideRightStep2.png'),
  sideLeft: require('../../assets/images/pixelArt/maddy/pixelMsideLeft.png'),
  sideLeftStep1: require('../../assets/images/pixelArt/maddy/pixelMsideLeftStep1.png'),
  sideLeftStep2: require('../../assets/images/pixelArt/maddy/pixelMsideLeftStep2.png'),
  floating: require('../../assets/images/pixelArt/maddy/pixelMfloating.png'),
  sleep1: require('../../assets/images/pixelArt/maddy/pixelMSleep1.png'),
  sleep2: require('../../assets/images/pixelArt/maddy/pixelMSleep2.png'),
  sleep3: require('../../assets/images/pixelArt/maddy/pixelMSleep3.png'),
  sleep4: require('../../assets/images/pixelArt/maddy/pixelMSleep4.png'),
};

const directions = [
  'forward', 'backward', 'left', 'right',
  'leftBackward', 'rightBackward', 'sideRight', 'sideLeft',
] as const;
type Direction = typeof directions[number];

const { width, height } = Dimensions.get('window');
const SPRITE_SIZE = 48;
const BOUNDS = {
  minX: 20,
  maxX: width - SPRITE_SIZE - 20,
  minY: 100,
  maxY: height - SPRITE_SIZE - 120, // leave space for tab bar
};

const SPRITE_WALK_SPEED = 0.05; // pixels per millisecond (slower speed)

export default function HomeScreen() {
  const [direction, setDirection] = useState<Direction>('forward');
  const [walking, setWalking] = useState(false);
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState({ x: width / 2 - SPRITE_SIZE / 2, y: height / 2 - SPRITE_SIZE / 2 });
  const anim = useRef(new Animated.ValueXY(pos)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [sleepStep, setSleepStep] = useState(0);
  const dragOffset = useRef({ x: 0, y: 0 }).current;
  const [isInitialized, setIsInitialized] = useState(false);

  // Animation frame loop for walking and sleeping
  useEffect(() => {
    if (isFrozen) return; // Pause animation while frozen
    let frameInterval: any;
    if (sleeping) {
      frameInterval = setInterval(() => {
        setSleepStep((prev) => (prev === 3 ? 0 : prev + 1));
      }, 500); // Slower sleep animation
    } else if (walking) {
      frameInterval = setInterval(() => {
        setStep((prev) => (prev === 0 ? 1 : 0));
      }, 200); // Faster walking animation
    } else {
      setStep(0);
    }
    return () => frameInterval && clearInterval(frameInterval);
  }, [walking, sleeping, isFrozen]);

  // Reset sleep step when waking up
  useEffect(() => {
    if (!sleeping) {
      setSleepStep(0);
    }
  }, [sleeping]);

  // Reset step state when transitioning from sleeping to walking
  useEffect(() => {
    if (walking && !sleeping) {
      setStep(0); // Reset step to start walking animation from frame 1
    }
  }, [walking, sleeping]);

  // Initialize the home screen with a brief delay for smooth transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // PanResponder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const { pageX, pageY } = evt.nativeEvent;
        const spriteX = (anim.x as any)._value;
        const spriteY = (anim.y as any)._value;
        
        // Check if touch is within sprite bounds
        if (
          pageX >= spriteX &&
          pageX <= spriteX + SPRITE_SIZE &&
          pageY >= spriteY &&
          pageY <= spriteY + SPRITE_SIZE
        ) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: (evt, gestureState) => {
        setDragging(true);
        setIsFrozen(true);
        dragOffset.x = gestureState.x0 - (anim.x as any)._value;
        dragOffset.y = gestureState.y0 - (anim.y as any)._value;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = gestureState.moveX - dragOffset.x;
        const newY = gestureState.moveY - dragOffset.y;
        anim.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: (evt, gestureState) => {
        setDragging(false);
        const currentX = (anim.x as any)._value;
        const currentY = (anim.y as any)._value;
        const maxY = BOUNDS.maxY;
        const fallY = Math.min(currentY + 60, maxY);
        // Animate fall
        Animated.timing(anim, {
          toValue: { x: currentX, y: fallY },
          duration: 400,
          useNativeDriver: false,
        }).start(() => {
          setPos({ x: currentX, y: fallY });
          setTimeout(() => {
            setIsFrozen(false); // Unfreeze after pause
          }, 1000);
        });
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        setIsFrozen(false);
      },
    })
  ).current;

  // Random action script
  useEffect(() => {
    if (isFrozen || sleeping) return; // Pause all movement and animation while frozen or sleeping
    let timeout: any;

    const doAction = () => {
      // Randomly decide to walk, idle, or sleep
      const actionRoll = Math.random();

      if (actionRoll > 0.95) { // 5% chance to sleep
        setWalking(false);
        // Stop the random action script first by setting sleeping to true
        setSleeping(true);
        // The effect will re-run and pause the script
        // Sleep for 10 seconds, then resume
        setTimeout(() => {
          setSleeping(false);
          // The effect will re-run and resume normal actions
        }, 10000);
        return; // Exit early to prevent scheduling more actions
      } else if (actionRoll > 0.4) { // 58% chance to walk
        const dir = directions[Math.floor(Math.random() * directions.length)];
        setDirection(dir);
        setWalking(true);
        setSleeping(false);
        console.log(`Action: Walking, Direction: ${dir}`);

        const dist = 60 + Math.random() * 30; // Pick a random distance (60-90px)

        let dx = 0, dy = 0;
        let chosenDirection: Direction = dir; // Store the randomly chosen direction

        switch (chosenDirection) {
          case 'forward': dy = dist; break;
          case 'backward': dy = -dist; break;
          case 'left': dx = -dist * 0.7; dy = dist * 0.7; break;
          case 'right': dx = dist * 0.7; dy = dist * 0.7; break;
          case 'leftBackward': dx = -dist * 0.7; dy = -dist * 0.7; break;
          case 'rightBackward': dx = dist * 0.7; dy = -dist * 0.7; break;
          case 'sideRight': dx = dist; break;
          case 'sideLeft': dx = -dist; break;
        }

        // Re-evaluate direction based on actual dx and dy to ensure consistency
        if (dx > 0 && dy > 0) setDirection('right');
        else if (dx < 0 && dy > 0) setDirection('left');
        else if (dx > 0 && dy < 0) setDirection('rightBackward');
        else if (dx < 0 && dy < 0) setDirection('leftBackward');
        else if (dx === 0 && dy > 0) setDirection('forward');
        else if (dx === 0 && dy < 0) setDirection('backward');
        else if (dx > 0 && dy === 0) setDirection('sideRight');
        else if (dx < 0 && dy === 0) setDirection('sideLeft');
        else setDirection(chosenDirection); // Fallback if no specific match

        const newX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, pos.x + dx));
        const newY = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, pos.y + dy));
        const duration = dist / SPRITE_WALK_SPEED;
        console.log(`Moving ${dir}: from (${pos.x.toFixed(0)}, ${pos.y.toFixed(0)}) to (${newX.toFixed(0)}, ${newY.toFixed(0)}), dist=${dist.toFixed(0)}, duration=${duration.toFixed(0)}`);

        Animated.timing(anim, {
          toValue: { x: newX, y: newY },
          duration: duration, // Slower movement for better animation visibility
          useNativeDriver: false,
        }).start(() => {
          setPos({ x: newX, y: newY }); // Update pos state after animation completes
          setWalking(false);
          // Moderate pause after walking (1-2.5 seconds)
          timeout = setTimeout(doAction, 1000 + Math.random() * 1500);
        });
      } else { // 40% chance to idle
        setWalking(false);
        setSleeping(false);
        console.log(`Action: Idling`);
        // Moderate pause when idling (1.5-3 seconds)
        timeout = setTimeout(doAction, 1500 + Math.random() * 1500);
      }
    };

    // Initial delay before first action (0.5-1.5 seconds)
    timeout = setTimeout(doAction, 500 + Math.random() * 1000);

    return () => clearTimeout(timeout);
  }, [isFrozen, sleeping]); // Re-run if isFrozen or sleeping changes

  // Pick correct sprite
  let sprite;
  if (dragging) {
    sprite = sprites.floating;
  } else if (sleeping) {
    // Only show sleep frames when actually sleeping
    const sleepFrame = sleepStep + 1;
    sprite = sprites[`sleep${sleepFrame}` as keyof typeof sprites];
  } else if (walking) {
    if (direction === 'forward') sprite = step === 0 ? sprites.forwardStep1 : sprites.forwardStep2;
    else if (direction === 'backward') sprite = step === 0 ? sprites.backwardStep1 : sprites.backwardStep2;
    else if (direction === 'sideLeft') sprite = step === 0 ? sprites.sideLeftStep1 : sprites.sideLeftStep2;
    else if (direction === 'sideRight') sprite = step === 0 ? sprites.sideRightStep1 : sprites.sideRightStep2;
    else if (direction === 'left') sprite = step === 0 ? sprites.leftStep1 : sprites.leftStep2;
    else if (direction === 'right') sprite = step === 0 ? sprites.rightStep1 : sprites.rightStep2;
    else if (direction === 'leftBackward') sprite = step === 0 ? sprites.leftBackwardStep1 : sprites.leftBackwardStep2;
    else if (direction === 'rightBackward') sprite = step === 0 ? sprites.rightBackwardStep1 : sprites.rightBackwardStep2;
    else sprite = sprites[direction]; // Use base sprite for directions without step animations
  } else {
    sprite = sprites[direction];
  }
  console.log(`Sprite selection: direction=${direction}, walking=${walking}, step=${step}, dragging=${dragging}, sleeping=${sleeping}, chosenSprite=${sprite ? sprite.toString().split('/').pop() : 'undefined'}`);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#66BB6A" />
      </View>
    );
  }

  return (
    <View style={styles.absoluteFill} {...panResponder.panHandlers}>
      <ImageBackground
        source={isoMap}
        style={styles.absoluteFill}
        resizeMode="cover"
        onLoadEnd={() => setImageLoaded(true)}
      >
        <StatusBar style="light" backgroundColor="transparent" translucent />
        {!imageLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#66BB6A" />
          </View>
        )}
        <Animated.Image
          source={sprite}
          style={[
            styles.sprite,
            { left: anim.x, top: anim.y },
          ]}
          resizeMode="contain"
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: { flex: 1, ...StyleSheet.absoluteFillObject },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4B0082',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sprite: { width: SPRITE_SIZE, height: SPRITE_SIZE, position: 'absolute', zIndex: 1 },
}); 