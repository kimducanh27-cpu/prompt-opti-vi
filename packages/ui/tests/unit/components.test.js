import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { PoButtonUI, ContentCardUI } from '../../src'

describe('基础UI组件测试', () => {
  // Slice 8: ActionButton was deleted (its only importers were these tests);
  // its assertions now cover PoButton, the only button primitive.
  describe('PoButtonUI', () => {
    it('应该正确渲染按钮文本', () => {
      const buttonText = '测试按钮'
      const wrapper = mount(PoButtonUI, {
        props: {
          variant: 'primary',
        },
        slots: {
          default: buttonText,
        },
      })
      expect(wrapper.text()).toContain(buttonText)
    })

    it('应该正确处理loading状态', async () => {
      const wrapper = mount(PoButtonUI, {
        props: {
          variant: 'primary',
          loading: false,
        },
        slots: {
          default: '测试按钮',
        },
      })

      expect(wrapper.props('loading')).toBe(false)

      await wrapper.setProps({ loading: true })
      expect(wrapper.props('loading')).toBe(true)
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })

  describe('ContentCardUI', () => {
    it('应该正确渲染slot内容', () => {
      const slotContent = '测试内容'
      const wrapper = mount(ContentCardUI, {
        slots: {
          default: slotContent
        }
      })
      expect(wrapper.text()).toContain(slotContent)
    })
  })
})
