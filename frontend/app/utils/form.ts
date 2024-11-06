/**
 * 获取表单中的元素
 * @template T 表单元素的类型
 * @param e 表单 Event
 * @param name 表单元素的 name
 * @returns 返回表单元素（默认为 Input）
 */
export const getForm = <T = HTMLInputElement>(e: React.FormEvent<HTMLFormElement>, name: string): T => {
    return e.currentTarget.elements.namedItem(name) as T;
}
