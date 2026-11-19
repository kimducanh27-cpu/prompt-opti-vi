import type { Ref } from 'vue'
import type { SubModeKey } from '../../stores/session/useSessionManager'

interface WorkspaceRouteSwitchOptions {
  hasRestoredInitialState: Ref<boolean>
  parseSubModeKey: (path: string) => SubModeKey | null
  getActiveSubModeKey: () => SubModeKey | null
  switchMode: (fromKey: SubModeKey, toKey: SubModeKey) => Promise<void>
  switchSubMode: (fromKey: SubModeKey, toKey: SubModeKey) => Promise<void>
  restoreSessionToUI: () => Promise<void>
  onError?: (error: unknown, fromKey: SubModeKey, toKey: SubModeKey) => void
}

interface RouteChangeOptions {
  externalDataLoading?: boolean
}

const getModeFromSubModeKey = (key: SubModeKey) => key.split('-')[0]

export const createWorkspaceRouteSwitchController = (options: WorkspaceRouteSwitchOptions) => {
  const activeSwitches = new Map<string, Promise<void>>()
  let switchQueue: Promise<void> = Promise.resolve()
  let lastSettledToKey: SubModeKey | null = null
  let pendingCount = 0

  const run = (toPath: string, fromPath: string): Promise<void> => {
    if (!options.hasRestoredInitialState.value) return Promise.resolve()

    const fromKey = options.parseSubModeKey(fromPath) ?? options.getActiveSubModeKey()
    const toKey = options.parseSubModeKey(toPath)

    if (!fromKey || !toKey || fromKey === toKey) return Promise.resolve()

    const switchKey = `${fromKey}->${toKey}`
    const existingSwitch = activeSwitches.get(switchKey)
    if (existingSwitch) {
      return existingSwitch
    }

    const chained = pendingCount > 0
    pendingCount++

    const executeSwitch = async () => {
      // VL-B-OBS3-01: trust the fromKey captured in run() from fromPath (the
      // pre-navigation path). Do NOT re-derive it from getActiveSubModeKey():
      // the readers are route-derived computeds (PromptOptimizerApp.vue
      // injects routeFunctionMode / routeProSubMode / ...), and run() is
      // invoked only AFTER the route has already changed (route watcher and
      // navigateToSubModeKey both call it post-push), so the re-derived key
      // already equals toKey and the switch early-returned on EVERY route
      // change — switchMode / switchSubMode / restoreSessionToUI (and the
      // pro-multi default-message seed in restoreProMultiMessageSession)
      // never ran on arrival.
      // Chaining rule for queued switches: the first transaction in a chain
      // uses its captured fromKey. A transaction queued behind another uses
      // the last settled key (lastSettledToKey) — the destination of a
      // completed switch recorded by this controller — falling back to the
      // captured fromKey only if no switch has settled yet in this chain.
      // Two queued navigateToSubModeKey calls can capture the same fromPath
      // (both read currentRoute before the first push resolves), so the
      // captured fromKey is stale for the second transaction and would save
      // the first destination's live session under the wrong key.
      const effectiveFromKey = chained ? (lastSettledToKey ?? fromKey) : fromKey
      if (!effectiveFromKey || effectiveFromKey === toKey) return

      const fromMode = getModeFromSubModeKey(effectiveFromKey)
      const toMode = getModeFromSubModeKey(toKey)

      if (fromMode !== toMode) {
        await options.switchMode(effectiveFromKey, toKey)
      } else {
        await options.switchSubMode(effectiveFromKey, toKey)
      }

      await options.restoreSessionToUI()
      lastSettledToKey = toKey
    }

    const promise = switchQueue.then(executeSwitch, executeSwitch)
    activeSwitches.set(switchKey, promise)
    switchQueue = promise.catch(() => {})

    void promise.finally(() => {
      if (activeSwitches.get(switchKey) === promise) {
        activeSwitches.delete(switchKey)
      }
      pendingCount--
      if (pendingCount === 0) lastSettledToKey = null
    })

    return promise
  }

  const handleRouteChange = async (
    toPath: string,
    fromPath: string,
    routeChangeOptions: RouteChangeOptions = {},
  ) => {
    if (routeChangeOptions.externalDataLoading) return

    try {
      await run(toPath, fromPath)
    } catch (error) {
      const fromKey = options.parseSubModeKey(fromPath) ?? options.getActiveSubModeKey()
      const toKey = options.parseSubModeKey(toPath)
      if (fromKey && toKey) {
        options.onError?.(error, fromKey, toKey)
      }
    }
  }

  return {
    run,
    handleRouteChange,
  }
}
