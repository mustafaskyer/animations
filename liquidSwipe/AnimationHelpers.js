import Animated from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'

const {
   Clock,
   SpringUtils,
   block,
   startClock,
   spring,
   Value,
   set,
   cond,
   stopClock,
   and, 
   eq,
   not,
   clockRunning,
   add,
   diffClamp
} = Animated

export const followPointer = (value) => {
   const clock = new Clock()
   const config = SpringUtils.makeDefaultConfig()
   const state = {
      position: new Value(0),
      velocity: new Value(0),
      finished: new Value(0),
      time: new Value(0),
   }
   return block(([
      startClock(clock),
      set(config.toValue, value),
      spring(clock, state, config),
      state.position
   ]), [])
}

export const snapProgress = (
   value,
   gesturestate,
   isBack,
   snapPoint
) => {
   const offset = new Value(0)
   const clock = new Clock()
   const config = SpringUtils.makeDefaultConfig()
   const state = {
      position: new Value(0),
      velocity: new Value(0),
      finished: new Value(0),
      time: new Value(0),
   }

   return block([
      cond(eq(gesturestate, State.ACTIVE), [
         cond(clockRunning(clock), [
            set(offset, state.position),
            stopClock(clock),
         ], set( state.position, diffClamp(add(offset, value), 0, 1)  )),
         // set(config.toValue, value),
      ], [
         cond( not(clockRunning(clock) ), [
            set(state.time, 0),
            set(state.finished, 0),
            set(config.toValue, snapPoint),
            startClock(clock)
         ]),
         spring(clock, state, config),
         cond( and( eq(state.finished, 1), clockRunning(clock)  ), [
            stopClock(clock),
            set(isBack, snapPoint),
            set(offset, 0)
         ])
      ]),
      state.position
   ])
}