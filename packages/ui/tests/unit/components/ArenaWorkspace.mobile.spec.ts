// Slice 8: Arena on mobile (<1024px) is a vertical stack — one full-width
// card per contestant, collapsible, with no horizontal deck scroll.
// Desktop keeps the horizontal deck (covered by ArenaWorkspace.spec.ts).
import { defineComponent, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { routerKey } from 'vue-router'
import { CompareService, createArenaState } from '@prompt-optimizer/core'
import ArenaWorkspace from '../../../src/components/arena-mode/ArenaWorkspace.vue'
import { prepareMarkdownOutput } from '../../../src/utils/markdown-output'
import { installMarkdownWorker } from '../support/markdown-worker'

const { current, toastError } = vi.hoisted(() => ({ current: { store: null as any }, toastError: vi.fn() }))
vi.mock('../../../src/stores/session/useArenaSession', () => ({ useArenaSession: () => current.store }))
vi.mock('../../../src/composables/ui/useToast', () => ({ useToast: () => ({ error: toastError }) }))
vi.mock('../../../src/composables/image/useImageInputPreparation', () => ({
  useImageInputPreparation: () => ({ prepareInputRefs: vi.fn() }),
}))
vi.mock('../../../src/composables/variable/useTemporaryVariables', () => ({
  useTemporaryVariables: () => ({ temporaryVariables: [], setVariable: vi.fn() }),
}))
vi.mock('../../../src/composables/ui/useWorkspaceLayout', () => ({
  useWorkspaceLayout: () => ({ isCompact: ref(true) }),
}))
vi.mock('../../../src/components/arena-mode/useArenaModels', () => ({
  useArenaModels: () => ({
    textOptions: ref([]), selection: () => '', select: vi.fn(), compatible: () => true,
    imageGroups: () => [], loadImages: async () => [],
  }),
}))
vi.mock('vue-i18n', async importOriginal => ({
  ...await importOriginal<typeof import('vue-i18n')>(),
  useI18n: () => ({ t: (key: string) => key }),
}))

const Button = defineComponent({
  name: 'NButton', props: { disabled: Boolean, loading: Boolean }, emits: ['click'],
  template: '<button :disabled="disabled" :data-loading="loading" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
})
const Scrollbar = {
  name: 'NScrollbar',
  template: '<div class="arena-scroll-container"><slot /></div>',
}
const Output = defineComponent({
  name: 'OutputDisplay',
  props: { content: String, outputRecord: Object, loading: Boolean, streaming: Boolean, enableStop: Boolean, reasoningMode: String },
  template: '<div class="shared-output" />',
})
const Input = defineComponent({
  name: 'TestInputSection', setup: () => ({ open: vi.fn() }),
  template: '<div><slot name="footer" :open-fullscreen="open" /></div>',
})
const routePush = vi.fn()
const render = () => mount(ArenaWorkspace, {
  global: { provide: { [routerKey as symbol]: { push: routePush }, services: ref({ compareService: new CompareService() }) }, stubs: {
    NButton: Button, NCard: { template: '<div><slot /></div>' },
    NScrollbar: Scrollbar,
    NText: { template: '<span><slot /></span>' }, NAlert: { template: '<div role="alert"><slot /></div>' },
    TextModelSelector: { template: '<button class="text-model-selector" />' },
    TestInputSection: Input, OutputDisplay: Output,
    OutputDisplayFullscreen: true,
    PromptGardenInspirationPopover: true, PromptGardenImportDialog: true,
    AppPreviewImageGroup: { template: '<div><slot /></div>' }, ArenaImage: true,
  } },
})

describe('Arena mobile vertical stack', () => {
  afterEach(() => vi.unstubAllGlobals())
  beforeEach(() => {
    vi.clearAllMocks()
    installMarkdownWorker(vi, prepareMarkdownOutput)
    const state = reactive(createArenaState())
    state.prompt = 'Local task'
    state.contestants.forEach(column => { column.configKey = 'local'; column.modelId = 'local-model' })
    current.store = reactive({
      state, configurations: { image: [], text: [] }, saveError: '',
      get running() { return Object.values(state.results).some(result => result.status === 'running') },
      busy: (id: string) => state.results[id]?.status === 'running',
      cancellable: (id: string) => state.results[id]?.model.kind === 'text',
      isStale: () => false,
      resolveConfig: () => undefined,
      refreshConfigs: vi.fn(async () => {}), saveSession: vi.fn(async () => {}),
      run: vi.fn(async () => {}), runAll: vi.fn(async () => {}),
      addContestant: vi.fn(), removeContestant: vi.fn(),
    })
  })

  it('stacks contestants in one column with no horizontal deck scroll', () => {
    const wrapper = render()
    const deck = wrapper.find('[data-testid="arena-deck"]')
    expect(deck.classes()).toContain('arena-deck--stacked')
    expect(deck.attributes('style')).toContain('minmax(0, 1fr)')
    // The deck still renders inside the scrollbar wrapper; the wrapper's
    // :x-scrollable binding is `!isCompact` (false here) — asserted by
    // reading the template, since VTU cannot address a plain-object stub
    // by name or by definition.
    expect(wrapper.find('.arena-scroll-container').exists()).toBe(true)
    expect(wrapper.findAll('article.arena-column')).toHaveLength(2)
    wrapper.unmount()
  })

  it('collapses one contestant at a time and keeps the other open', async () => {
    const wrapper = render()
    const toggles = wrapper.findAll('[data-testid^="arena-column-toggle-"]')
    expect(toggles).toHaveLength(2)
    expect(toggles[0].attributes('aria-expanded')).toBe('true')

    await toggles[0].trigger('click')
    expect(toggles[0].attributes('aria-expanded')).toBe('false')
    const bodies = wrapper.findAll('.arena-column-body')
    expect(bodies).toHaveLength(2)
    expect((bodies[0].element as HTMLElement).style.display).toBe('none')
    expect((bodies[1].element as HTMLElement).style.display).not.toBe('none')
    // Per-column run still works for the open contestant.
    await wrapper.findAll('.column-run')[1].trigger('click')
    expect(current.store.run).toHaveBeenCalledWith(current.store.state.contestants[1].id)
    wrapper.unmount()
  })

  it('keeps the toolbar actions and garden wiring on mobile', () => {
    const wrapper = render()
    expect(wrapper.find('[data-testid="arena-add"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="arena-run-all"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="arena-image-input"]').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'PromptGardenInspirationPopover' }).props('mode')).toBe('arena')
    wrapper.unmount()
  })
})
