import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, Animated, StyleSheet, Dimensions, ActivityIndicator, View, PanResponder } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const isoMap = require('../../assets/images/pixelArt/isometric_map_320x400.png');
const maddyAppTitle = require('../../assets/images/pixelArt/maddyApp.png');

const sprites = {
  // Maddy (pixelM)
  pixelMforward: require('../../assets/images/pixelArt/maddy/pixelMforward.png'),
  pixelMforwardStep1: require('../../assets/images/pixelArt/maddy/pixelMforwardStep1.png'),
  pixelMforwardStep2: require('../../assets/images/pixelArt/maddy/pixelMforwardStep2.png'),
  pixelMbackward: require('../../assets/images/pixelArt/maddy/pixelMbackwards.png'),
  pixelMbackwardStep1: require('../../assets/images/pixelArt/maddy/pixelMbackwardsStep1.png'),
  pixelMbackwardStep2: require('../../assets/images/pixelArt/maddy/pixelMbackwardsStep2.png'),
  pixelMleft: require('../../assets/images/pixelArt/maddy/pixelMleft.png'),
  pixelMleftStep1: require('../../assets/images/pixelArt/maddy/pixelMleftStep1.png'),
  pixelMleftStep2: require('../../assets/images/pixelArt/maddy/pixelMleftStep2.png'),
  pixelMright: require('../../assets/images/pixelArt/maddy/pixelMright.png'),
  pixelMrightStep1: require('../../assets/images/pixelArt/maddy/pixelMrightStep1.png'),
  pixelMrightStep2: require('../../assets/images/pixelArt/maddy/pixelMrightStep2.png'),
  pixelMleftBackward: require('../../assets/images/pixelArt/maddy/pixelMleftBackward.png'),
  pixelMleftBackwardStep1: require('../../assets/images/pixelArt/maddy/pixelMleftBackwardStep1.png'),
  pixelMleftBackwardStep2: require('../../assets/images/pixelArt/maddy/pixelMleftBackwardStep2.png'),
  pixelMrightBackward: require('../../assets/images/pixelArt/maddy/pixelMrightBackward.png'),
  pixelMrightBackwardStep1: require('../../assets/images/pixelArt/maddy/pixelMrightBackwardStep1.png'),
  pixelMrightBackwardStep2: require('../../assets/images/pixelArt/maddy/pixelMrightBackwardStep2.png'),
  pixelMsideRight: require('../../assets/images/pixelArt/maddy/pixelMsideRight.png'),
  pixelMsideRightStep1: require('../../assets/images/pixelArt/maddy/pixelMsideRightStep1.png'),
  pixelMsideRightStep2: require('../../assets/images/pixelArt/maddy/pixelMsideRightStep2.png'),
  pixelMsideLeft: require('../../assets/images/pixelArt/maddy/pixelMsideLeft.png'),
  pixelMsideLeftStep1: require('../../assets/images/pixelArt/maddy/pixelMsideLeftStep1.png'),
  pixelMsideLeftStep2: require('../../assets/images/pixelArt/maddy/pixelMsideLeftStep2.png'),
  pixelMfloating: require('../../assets/images/pixelArt/maddy/pixelMfloating.png'),
  pixelMsleep1: require('../../assets/images/pixelArt/maddy/pixelMSleep1.png'),
  pixelMsleep2: require('../../assets/images/pixelArt/maddy/pixelMSleep2.png'),
  pixelMsleep3: require('../../assets/images/pixelArt/maddy/pixelMSleep3.png'),
  pixelMsleep4: require('../../assets/images/pixelArt/maddy/pixelMSleep4.png'),

  // C (pixelC)
  pixelCforward: require('../../assets/images/pixelArt/maddy/pixelCforwards.png'),
  pixelCforwardStep1: require('../../assets/images/pixelArt/maddy/pixelCforwardsStep1.png'),
  pixelCforwardStep2: require('../../assets/images/pixelArt/maddy/pixelCforwardsStep2.png'),
  pixelCbackward: require('../../assets/images/pixelArt/maddy/pixelCbackwards.png'),
  pixelCbackwardStep1: require('../../assets/images/pixelArt/maddy/pixelCbackwardsStep1.png'),
  pixelCbackwardStep2: require('../../assets/images/pixelArt/maddy/pixelCbackwardsStep2.png'),
  pixelCsideLeft: require('../../assets/images/pixelArt/maddy/pixelCsideLeft.png'),
  pixelCsideLeftStep1: require('../../assets/images/pixelArt/maddy/pixelCsideLeftStep1.png'),
  pixelCsideLeftStep2: require('../../assets/images/pixelArt/maddy/pixelCsideLeftStep2.png'),
  pixelCsideRight: require('../../assets/images/pixelArt/maddy/pixelCsideRight.png'),
  pixelCsideRightStep1: require('../../assets/images/pixelArt/maddy/pixelCsideRightStep1.png'),
  pixelCsideRightStep2: require('../../assets/images/pixelArt/maddy/pixelCsideRightStep2.png'),
  pixelCfloating: require('../../assets/images/pixelArt/maddy/pixelCfloating.png'),
  pixelCbasketball1: require('../../assets/images/pixelArt/maddy/pixelCbasketball1.png'),
  pixelCbasketball2: require('../../assets/images/pixelArt/maddy/pixelCbasketball2.png'),
  pixelCbasketball3: require('../../assets/images/pixelArt/maddy/pixelCbasketball3.png'),
  pixelCbasketball4: require('../../assets/images/pixelArt/maddy/pixelCbasketball4.png'),
  pixelCbasketball5: require('../../assets/images/pixelArt/maddy/pixelCbasketball5.png'),
  pixelCbasketball6: require('../../assets/images/pixelArt/maddy/pixelCbasketball6.png'),
  pixelCbasketball7: require('../../assets/images/pixelArt/maddy/pixelCbasketball7.png'),
  pixelCbasketball8: require('../../assets/images/pixelArt/maddy/pixelCbasketball8.png'),
  pixelCbasketball9: require('../../assets/images/pixelArt/maddy/pixelCbasketball9.png'),
  pixelCbasketball10: require('../../assets/images/pixelArt/maddy/pixelCbasketball10.png'),
  pixelCbasketball11: require('../../assets/images/pixelArt/maddy/pixelCbasketball11.png'),
  pixelCbasketball12: require('../../assets/images/pixelArt/maddy/pixelCbasketball12.png'),
};

type SpriteKey = keyof typeof sprites;

const directions = [
  'forward', 'backward', 'left', 'right',
  'leftBackward', 'rightBackward', 'sideRight', 'sideLeft',
] as const;
type Direction = typeof directions[number];

interface SpriteConfig {
  prefix: string;
  floating: SpriteKey;
  specialActionName: string;
  specialActionFrames: number;
  hasDiagonal: boolean;
  forward?: SpriteKey;
  forwardStep1?: SpriteKey;
  forwardStep2?: SpriteKey;
  backward?: SpriteKey;
  backwardStep1?: SpriteKey;
  backwardStep2?: SpriteKey;
}

const { width, height } = Dimensions.get('window');
const SPRITE_SIZE = 48;
const BOUNDS = {
  minX: 20,
  maxX: width - SPRITE_SIZE - 20,
  minY: 100,
  maxY: height - SPRITE_SIZE - 120,
};

const SPRITE_WALK_SPEED = 0.05;

const useSpriteAnimation = (config: SpriteConfig) => {
  const [direction, setDirection] = useState<Direction>('forward');
  const [walking, setWalking] = useState(false);
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState({ x: width / 2 - SPRITE_SIZE / 2, y: height / 2 - SPRITE_SIZE / 2 });
  const anim = useRef(new Animated.ValueXY(pos)).current;
  const [dragging, setDragging] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [specialAction, setSpecialAction] = useState(false);
  const [specialActionStep, setSpecialActionStep] = useState(0);
  const dragOffset = useRef({ x: 0, y: 0 }).current;

  useEffect(() => {
    if (isFrozen) return;
    let frameInterval: any;
    if (specialAction) {
      frameInterval = setInterval(() => {
        setSpecialActionStep((prev) => (prev === config.specialActionFrames - 1 ? 0 : prev + 1));
      }, 100);
    } else if (walking) {
      frameInterval = setInterval(() => {
        setStep((prev) => (prev === 0 ? 1 : 0));
      }, 200);
    } else {
      setStep(0);
    }
    return () => frameInterval && clearInterval(frameInterval);
  }, [walking, specialAction, isFrozen, config.specialActionFrames]);

  useEffect(() => {
    if (!specialAction) {
      setSpecialActionStep(0);
    }
  }, [specialAction]);

  useEffect(() => {
    if (walking && !specialAction) {
      setStep(0);
    }
  }, [walking, specialAction]);

  useEffect(() => {
    if (isFrozen || specialAction) return;
    let timeout: any;

    const doAction = () => {
      const actionRoll = Math.random();

      if (actionRoll > 0.95) {
        setWalking(false);
        setSpecialAction(true);
        setTimeout(() => {
          setSpecialAction(false);
        }, 10000);
        return;
      } else if (actionRoll > 0.4) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        setDirection(dir);
        setWalking(true);
        setSpecialAction(false);

        const dist = 60 + Math.random() * 30;
        let dx = 0, dy = 0;
        let chosenDirection: Direction = dir;

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

        if (dx > 0 && dy > 0) setDirection('right');
        else if (dx < 0 && dy > 0) setDirection('left');
        else if (dx > 0 && dy < 0) setDirection('rightBackward');
        else if (dx < 0 && dy < 0) setDirection('leftBackward');
        else if (dx === 0 && dy > 0) setDirection('forward');
        else if (dx === 0 && dy < 0) setDirection('backward');
        else if (dx > 0 && dy === 0) setDirection('sideRight');
        else if (dx < 0 && dy === 0) setDirection('sideLeft');
        else setDirection(chosenDirection);

        const newX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, pos.x + dx));
        const newY = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, pos.y + dy));
        const duration = dist / SPRITE_WALK_SPEED;

        Animated.timing(anim, {
          toValue: { x: newX, y: newY },
          duration: duration,
          useNativeDriver: false,
        }).start(() => {
          setPos({ x: newX, y: newY });
          setWalking(false);
          timeout = setTimeout(doAction, 1000 + Math.random() * 1500);
        });
      } else {
        setWalking(false);
        setSpecialAction(false);
        timeout = setTimeout(doAction, 1500 + Math.random() * 1500);
      }
    };

    timeout = setTimeout(doAction, 500 + Math.random() * 1000);
    return () => clearTimeout(timeout);
  }, [isFrozen, specialAction, pos.x, pos.y, anim]);

  let sprite: any;
  if (dragging) {
    sprite = sprites[config.floating];
  } else if (specialAction) {
    const specialActionFrame = specialActionStep + 1;
    const spriteKey = `${config.specialActionName}${specialActionFrame}` as SpriteKey;
    sprite = sprites[spriteKey];
  } else if (walking) {
    const isUp = direction === 'leftBackward' || direction === 'rightBackward' || direction === 'backward';
    const isDown = direction === 'left' || direction === 'right' || direction === 'forward';
    if (!config.hasDiagonal && (isUp || isDown)) {
        if (isUp) {
            sprite = step === 0 ? sprites[config.backwardStep1!] : sprites[config.backwardStep2!];
        } else {
            sprite = step === 0 ? sprites[config.forwardStep1!] : sprites[config.forwardStep2!];
        }
    } else {
        const step1Key = `${config.prefix}${direction}Step1` as SpriteKey;
        const step2Key = `${config.prefix}${direction}Step2` as SpriteKey;
        sprite = step === 0 ? sprites[step1Key] : sprites[step2Key];
    }
  } else {
    const isUp = direction === 'leftBackward' || direction === 'rightBackward' || direction === 'backward';
    const isDown = direction === 'left' || direction === 'right' || direction === 'forward';
    if (!config.hasDiagonal && (isUp || isDown)) {
        if (isUp) {
            sprite = sprites[config.backward!];
        } else {
            sprite = sprites[config.forward!];
        }
    } else {
        const spriteKey = `${config.prefix}${direction}` as SpriteKey;
        sprite = sprites[spriteKey];
    }
  }

  return {
    anim,
    sprite,
    setDragging,
    setIsFrozen,
    dragOffset,
    pos,
    setPos,
  };
};

const pixelMConfig: SpriteConfig = {
  prefix: 'pixelM',
  floating: 'pixelMfloating',
  specialActionName: 'pixelMsleep',
  specialActionFrames: 4,
  hasDiagonal: true,
  forwardStep1: 'pixelMforwardStep1',
  forwardStep2: 'pixelMforwardStep2',
};

const pixelCConfig: SpriteConfig = {
    prefix: 'pixelC',
    floating: 'pixelCfloating',
    specialActionName: 'pixelCbasketball',
    specialActionFrames: 12,
    hasDiagonal: false,
    forward: 'pixelCforward',
    forwardStep1: 'pixelCforwardStep1',
    forwardStep2: 'pixelCforwardStep2',
    backward: 'pixelCbackward',
    backwardStep1: 'pixelCbackwardStep1',
    backwardStep2: 'pixelCbackwardStep2',
  };

export default function HomeScreen() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const maddy = useSpriteAnimation(pixelMConfig);
  const c = useSpriteAnimation(pixelCConfig);

  // Floating title animation
  const titleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Remove the artificial delay for faster loading
    setIsInitialized(true);
  }, []);

  // Start floating animation for title
  useEffect(() => {
    const floatAnimation = () => {
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(titleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => floatAnimation());
    };
    floatAnimation();
  }, [titleAnim]);

  const activeSpriteRef = useRef<any>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const { pageX, pageY } = evt.nativeEvent;
        const maddyX = (maddy.anim.x as any)._value;
        const maddyY = (maddy.anim.y as any)._value;
        const cX = (c.anim.x as any)._value;
        const cY = (c.anim.y as any)._value;

        if (
          pageX >= maddyX && pageX <= maddyX + SPRITE_SIZE &&
          pageY >= maddyY && pageY <= maddyY + SPRITE_SIZE
        ) {
          activeSpriteRef.current = maddy;
          return true;
        }
        if (
          pageX >= cX && pageX <= cX + SPRITE_SIZE &&
          pageY >= cY && pageY <= cY + SPRITE_SIZE
        ) {
          activeSpriteRef.current = c;
          return true;
        }
        return false;
      },
      onPanResponderGrant: (evt, gestureState) => {
        if (activeSpriteRef.current) {
          activeSpriteRef.current.setDragging(true);
          activeSpriteRef.current.setIsFrozen(true);
          activeSpriteRef.current.dragOffset.x = gestureState.x0 - (activeSpriteRef.current.anim.x as any)._value;
          activeSpriteRef.current.dragOffset.y = gestureState.y0 - (activeSpriteRef.current.anim.y as any)._value;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (activeSpriteRef.current) {
          const newX = gestureState.moveX - activeSpriteRef.current.dragOffset.x;
          const newY = gestureState.moveY - activeSpriteRef.current.dragOffset.y;
          activeSpriteRef.current.anim.setValue({ x: newX, y: newY });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (activeSpriteRef.current) {
          const sprite = activeSpriteRef.current;
          sprite.setDragging(false);
          const currentX = (sprite.anim.x as any)._value;
          const currentY = (sprite.anim.y as any)._value;
          const maxY = BOUNDS.maxY;
          const fallY = Math.min(currentY + 60, maxY);
          Animated.timing(sprite.anim, {
            toValue: { x: currentX, y: fallY },
            duration: 400,
            useNativeDriver: false,
          }).start(() => {
            sprite.setPos({ x: currentX, y: fallY });
            setTimeout(() => {
              sprite.setIsFrozen(false);
            }, 1000);
          });
        }
        activeSpriteRef.current = null;
      },
      onPanResponderTerminate: () => {
        if (activeSpriteRef.current) {
          activeSpriteRef.current.setDragging(false);
          activeSpriteRef.current.setIsFrozen(false);
        }
        activeSpriteRef.current = null;
      },
    })
  ).current;

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
        
        {/* Floating Title */}
        <Animated.View
          style={[
            styles.floatingTitle,
            {
              transform: [{
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10], // Float up and down by 10 pixels
                })
              }]
            }
          ]}
        >
          <Animated.Image 
            source={maddyAppTitle}
            style={styles.titleImage}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.Image
          source={maddy.sprite}
          style={[
            styles.sprite,
            { left: maddy.anim.x, top: maddy.anim.y },
          ]}
          resizeMode="contain"
        />
        <Animated.Image
          source={c.sprite}
          style={[
            styles.sprite,
            { left: c.anim.x, top: c.anim.y },
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
  floatingTitle: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#66BB6A',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'FredokaRegular',
  },
  titleImage: {
    width: 360,
    height: 108,
  },
});