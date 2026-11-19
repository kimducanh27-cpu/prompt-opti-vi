import type { TextModelConfig, Template } from '@prompt-optimizer/core'
import type { ModelSelectOption, TemplateSelectOption, SelectOption } from '../types/select-options'

interface ModelSelectTransformOptions {
  getProviderName?: (model: TextModelConfig) => string
  getModelName?: (model: TextModelConfig) => string
}

/**
 * 数据转换工具类
 * 负责将原始数据转换为SelectWithConfig组件所需的标准化格式
 */
export class DataTransformer {
  /**
   * 将模型配置转换为选择器选项
   * @param models 模型配置数组
   * @returns 标准化的模型选择选项
   */
  static modelsToSelectOptions(models: TextModelConfig[], options: ModelSelectTransformOptions = {}): ModelSelectOption[] {
    return models.map(model => {
      const providerName = options.getProviderName?.(model) ?? model.providerMeta?.name ?? model.providerMeta?.id ?? 'Unknown'
      const modelName = options.getModelName?.(model) ?? model.name
      return {
        primary: modelName,
        secondary: providerName,
        value: model.id,
        raw: model,
        // 保持向后兼容性
        label: `${modelName} (${providerName})`
      }
    })
  }

  /**
   * 模板选择器里只显示名称主体，去掉末尾的 "(Recommended)" / "（推荐）" 徽标。
   * V-R1-01: 42 字符全名 "General Message Optimization (Recommended)" 在 16px
   * 下宽约 353px，而 compact 触发器在 360px 视口下通体只有 328px —— 布局再怎么
   * 加宽都不可能放下（390px 下把内边距压到 ≤5px 才能放下，会压到下拉箭头；
   * 412px 下需要右内边距 26px→19px，文字会滑到箭头下面）。改布局不是解法，
   * 只能缩短显示名。徽标只是引导信息：该模板本来就是列表第一个（默认模板），
   * 完整名称仍保留在 raw.template.name 与模板管理器里（TemplateManager 直接
   * 渲染 template.name），核心模板定义本身不动。
   * 注意：只去掉末尾的这两个已知徽标写法，不动名称其余部分；用户模板若恰好
   * 以同样后缀结尾，在选择器里也会显示为去徽标版（管理器里仍是全名）。
   */
  private static stripRecommendedBadge(name: string): string {
    return name.replace(/\s*\(Recommended\)\s*$/, '').replace(/\s*（推荐）\s*$/, '')
  }

  /**
   * 选择器里只显示缩短版的超长模板名（目前只有这一个名字会溢出）。
   * V-R4 残留：英文名 "Photography Natural-Language Optimization"（41 字符，
   * 约 344px）在 390px 下短 14px、360px 下短 44px，而 412px 下刚好放下。
   * 没有 "(Recommended)" 徽标可去，所以 V-R1-01 的机制帮不上忙；布局再加宽
   * 也放不下（360px 下触发器通体 328px、内层只有 290px）。只在选择器显示层
   * 缩短，规则是精确匹配整个名字，不动其它名字：中文名“摄影向自然语言优化”
   * 只有 9 字（约 144px）本来就放得下，不受影响；raw.template.name 与模板
   * 管理器里的全名不动，核心模板定义不动；值仍是 template.id，匹配不受影响。
   * 宽度估算（V-R1 的实测换算：42 字符 ≈ 353px，即约 8.4px/字符）：
   * "Photography Optimization" 24 字符 ≈ 202px，360px 下内层 290px，余 ~88px。
   * 注意：同类的 "General Natural-Language Optimization"（38 字符）按同样
   * 的按字宽估算约 290–300px，对 360px 下 290px 内层是边界情况（可能只差
   * 一两个字符），V-R4 没有实测它。VL-F 已实测确认溢出（360px 下 sw=296
   * vs cw=290），缩短见 shortenGeneralNaturalLanguageName。
   */
  private static shortenPhotographyName(name: string): string {
    return name === 'Photography Natural-Language Optimization'
      ? 'Photography Optimization'
      : name
  }

  /**
   * 选择器里只显示缩短版的超长模板名（同 shortenPhotographyName 的模式）。
   * VL-F 实测确认：英文名 "General Natural-Language Optimization"（38 字符）
   * 在 360px 下 inner `.swc-primary` sw=296 vs cw=290，短 6px，末尾 "n"
   * 被下拉箭头切掉；390px（320px）与 412px（342px）下放得下。只在选择器
   * 显示层缩短，规则是精确匹配整个名字：raw.template.name 与模板管理器里
   * 的全名不动，核心模板定义不动；值仍是 template.id，匹配不受影响。
   * 撞名检查（VL-F 实测列表 + 源码核对）：text2imageOptimize 列表只有 5
   * 个英文模板 —— "General Natural-Language Optimization"、"Chinese
   * Aesthetics Optimization"、"Photography Optimization"（已缩短的显示名）、
   * "Deconstructive Creative Prompt"、"JSON Structured Prompt"；缩短后的
   * "General Optimization" 与其中任何一个都不撞。另一个同名模板
   * "General Optimization"（id general-optimize，templateType 'optimize'）
   * 属于基础优化列表，各按类型取列表（listTemplatesByType），从不在同一
   * 个选择器里出现。
   * 宽度估算（V-R1 的实测换算：42 字符 ≈ 353px，即约 8.4px/字符）：
   * "General Optimization" 20 字符 ≈ 168px，360px 下内层 290px，余 ~122px。
   */
  private static shortenGeneralNaturalLanguageName(name: string): string {
    return name === 'General Natural-Language Optimization'
      ? 'General Optimization'
      : name
  }

  /**
   * 将模板配置转换为选择器选项
   * @param templates 模板配置数组
   * @returns 标准化的模板选择选项
   */
  static templatesToSelectOptions(templates: Template[]): TemplateSelectOption[] {
    return templates.map(template => {
      // V-R1-01: 显示名去掉 "(Recommended)" 徽标，见 stripRecommendedBadge
      // V-R4 残留：超长名 "Photography Natural-Language Optimization" 在
      // 选择器里显示为缩短版，见 shortenPhotographyName
      // VL-F-01：超长名 "General Natural-Language Optimization" 在选择器里
      // 显示为缩短版，见 shortenGeneralNaturalLanguageName
      const displayName = DataTransformer.shortenGeneralNaturalLanguageName(
        DataTransformer.shortenPhotographyName(
          DataTransformer.stripRecommendedBadge(template.name || ''),
        ),
      )
      return {
        primary: displayName,
        secondary: template.metadata?.description || '',
        value: template.id,
        raw: template,
        // 保持向后兼容性
        label: displayName
      }
    })
  }

  /**
   * 通用转换函数
   * @param items 原始数据数组
   * @param getPrimary 提取主要显示文本的函数
   * @param getSecondary 提取次要显示文本的函数
   * @param getValue 提取值的函数
   * @returns 标准化的选择选项
   */
  static toSelectOptions<T>(
    items: T[],
    getPrimary: (item: T) => string,
    getSecondary: (item: T) => string,
    getValue: (item: T) => string
  ): SelectOption<T>[] {
    return items.map(item => {
      const primary = getPrimary(item)
      const secondary = getSecondary(item)
      return {
        primary,
        secondary,
        value: getValue(item),
        raw: item,
        // 生成兼容的label格式
        label: secondary ? `${primary} (${secondary})` : primary
      }
    })
  }
}

/**
 * 简化的访问器函数
 * 用于SelectWithConfig组件的prop函数
 */
export const OptionAccessors = {
  /**
   * 获取主要显示文本
   */
  getPrimary: (opt: SelectOption): string => opt.primary,

  /**
   * 获取次要显示文本
   */
  getSecondary: (opt: SelectOption): string => opt.secondary,

  /**
   * 获取选择值
   */
  getValue: (opt: SelectOption): string => opt.value
}
