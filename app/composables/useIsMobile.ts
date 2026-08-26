import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useIsMobile() {
  return useBreakpoints(breakpointsTailwind).smaller('sm')
}
