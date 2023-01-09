export class Debouncer {
  private resolve?: (result: boolean) => void
  private timeout?: ReturnType<typeof setTimeout>

  constructor(public delay: number = 1000) {}

  wait(): Promise<boolean> {
    this.timeout && clearTimeout(this.timeout)
    this.resolve?.(false)
    this.resolve = undefined

    return new Promise((resolve) => {
      this.resolve = resolve
      this.timeout = setTimeout(() => {
        resolve(true)
        if (this.resolve === resolve) {
          this.resolve = undefined
        }
      }, this.delay)
    })
  }
}
